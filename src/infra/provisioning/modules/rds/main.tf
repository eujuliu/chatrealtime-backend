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

resource "random_integer" "identifier_suffix" {
  min = 0
  max = 999999999999
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
  name                   = "${var.environment}-rds-security-group"
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
    Name        = "${var.environment}-rds-security-group"
    Environment = var.environment
  }
}

resource "aws_db_instance" "mysql" {
  identifier        = "${var.environment}-mysql-${random_integer.identifier_suffix.result}"
  storage_type      = var.storage_type
  allocated_storage = var.allocated_storage
  engine            = "mysql"
  engine_version    = var.engine_version
  instance_class    = var.instance_class

  username                    = "j${random_string.username.result}"
  password                    = random_password.password.result
  db_name                     = "chatrealtime"
  port                        = random_integer.port.result
  publicly_accessible         = true
  multi_az                    = false
  max_allocated_storage       = var.max_allocated_storage
  allow_major_version_upgrade = true
  auto_minor_version_upgrade  = true

  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = [aws_security_group.security_group.id]

  apply_immediately       = true
  backup_retention_period = var.backup_retention_period
  backup_window           = "04:00-05:00"
  maintenance_window      = "wed:06:00-wed:07:00"
  copy_tags_to_snapshot   = true
  skip_final_snapshot     = true

  tags = {
    Name        = "${var.environment}-mysql"
    Environment = var.environment
  }
}
