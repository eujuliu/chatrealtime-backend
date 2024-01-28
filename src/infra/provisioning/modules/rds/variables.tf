variable "vpc_id" {
  type = string
}

variable "vpc_cidr_block" {
  type = string
}

variable "environment" {
  type = string
}

variable "route_table_id" {
  type = string
}

variable "max_allocated_storage" {
  type = string
}

variable "backup_retention_period" {
  type = string
}

variable "storage_type" {
  type = string
}

variable "allocated_storage" {
  type = string
}

variable "engine_version" {
  type = string
}

variable "instance_class" {
  type = string
}

variable "db_subnet_group_name" {
  type = string
}

variable "subnets" {
  type = list(any)
}
