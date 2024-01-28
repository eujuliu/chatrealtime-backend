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

variable "instance_ami" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "volume_size" {
  type = string
}

variable "volume_type" {
  type = string
}

variable "ingress" {
  type = list(number)
  default = [
    22,
    443
  ]
}

variable "subnets" {
  type = list(any)
}
