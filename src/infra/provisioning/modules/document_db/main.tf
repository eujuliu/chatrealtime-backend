resource "random_integer" "identifier_suffix" {
  min = 0
  max = 999999999999
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "-+=_^~,."
}

resource "random_string" "username" {
  length  = 31
  special = false
}

resource "random_integer" "port" {
  min = 1024
  max = 49151
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_route_table_association" "route_table_association" {
  count          = length(var.subnets)
  subnet_id      = var.subnets[count.index].id
  route_table_id = var.route_table_id
}

resource "aws_security_group" "security_group" {
  name                   = "${var.environment}-mongodb-security-group"
  vpc_id                 = var.vpc_id
  revoke_rules_on_delete = true

  ingress {
    from_port        = random_integer.port.result
    to_port          = random_integer.port.result
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

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
    Name        = "${var.environment}-mongodb-security-group"
    Environment = var.environment
  }
}

resource "aws_docdb_cluster_instance" "cluster_instance" {
  count              = 1
  identifier         = "${var.environment}-mongodb-${random_integer.identifier_suffix.result}-${count.index}"
  cluster_identifier = aws_docdb_cluster.cluster.id
  instance_class     = var.instance_class

  tags = {
    Name        = "${var.environment}-mongodb-instance"
    Environment = var.environment
  }
}

resource "aws_docdb_cluster" "cluster" {
  cluster_identifier = "${var.environment}-mongodb-${random_integer.identifier_suffix.result}"
  master_username    = "j${random_string.username.result}"
  master_password    = random_password.password.result
  port               = random_integer.port.result

  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = [aws_security_group.security_group.id]

  backup_retention_period      = var.backup_retention_period
  apply_immediately            = true
  preferred_backup_window      = "04:00-05:00"
  preferred_maintenance_window = "wed:06:00-wed:07:00"
  skip_final_snapshot          = true

  engine_version = var.engine_version

  tags = {
    Name        = "${var.environment}-mongodb"
    Environment = var.environment
  }
}
