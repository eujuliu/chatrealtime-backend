output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "vpc_cidr_block" {
  value = aws_vpc.vpc.cidr_block
}

output "route_table_id" {
  value = aws_route_table.route_table.id
}

output "subnets" {
  value = aws_subnet.subnet
}

output "db_subnet_group_name" {
  value = aws_db_subnet_group.subnet_group.name
}
