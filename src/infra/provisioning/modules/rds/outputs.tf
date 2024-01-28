output "db_name" {
  value = aws_db_instance.mysql.db_name
}

output "username" {
  value = aws_db_instance.mysql.username
}

output "password" {
  value     = aws_db_instance.mysql.password
  sensitive = true
}

output "port" {
  value     = aws_db_instance.mysql.port
  sensitive = true
}

output "address" {
  value     = aws_db_instance.mysql.address
  sensitive = true
}
