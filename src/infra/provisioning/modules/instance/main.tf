data "aws_availability_zones" "available" {
  state = "available"

}

resource "aws_route_table_association" "route_table_association" {
  subnet_id      = var.subnets[0].id
  route_table_id = var.route_table_id
}

resource "aws_security_group" "instance_security_group" {
  name                   = "${var.environment}-instance-security-group"
  vpc_id                 = var.vpc_id
  revoke_rules_on_delete = true

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.environment}-instance-security-group"
    Environment = var.environment
  }
}

resource "aws_security_group_rule" "ingress_rules" {
  count = length(var.ingress)

  type              = "ingress"
  from_port         = var.ingress[count.index]
  to_port           = var.ingress[count.index]
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.instance_security_group.id
  description       = "Allow ${var.ingress[count.index]} port"
}

resource "aws_kms_key" "kms_ec2_key" {
  description             = "${var.environment}-ec2-key"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Name        = "${var.environment}-ec2-key"
    Environment = var.environment
  }
}

resource "aws_kms_alias" "kms_ec2_key_alias" {
  name          = "alias/${var.environment}-ec2-instance"
  target_key_id = aws_kms_key.kms_ec2_key.key_id
}

resource "tls_private_key" "ssh-key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "key_pair" {
  key_name   = "${var.environment}-ec2-key-pair"
  public_key = tls_private_key.ssh-key.public_key_openssh

  provisioner "local-exec" {
    command = "echo '${tls_private_key.ssh-key.private_key_pem}' > ./${var.environment}-ec2-key-pair.pem"
  }
}

resource "aws_eip" "instance_elastic_ip" {
  instance = aws_instance.ec2_instance.id

  tags = {
    Name        = "${var.environment}-eip"
    Environment = var.environment
  }
}

resource "aws_instance" "ec2_instance" {
  ami                         = var.instance_ami
  instance_type               = var.instance_type
  availability_zone           = data.aws_availability_zones.available.names[0]
  vpc_security_group_ids      = [aws_security_group.instance_security_group.id]
  subnet_id                   = var.subnets[0].id
  associate_public_ip_address = true
  key_name                    = aws_key_pair.key_pair.key_name

  root_block_device {
    volume_size           = var.volume_size
    volume_type           = var.volume_type
    encrypted             = true
    delete_on_termination = true
    kms_key_id            = aws_kms_key.kms_ec2_key.arn
  }

  tags = {
    Name        = var.environment
    Environment = var.environment
  }
}
