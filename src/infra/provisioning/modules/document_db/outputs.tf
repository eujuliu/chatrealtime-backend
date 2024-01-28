output "username" {
  value = aws_docdb_cluster.cluster.master_username
}

output "password" {
  value     = aws_docdb_cluster.cluster.master_password
  sensitive = true
}

output "port" {
  value     = aws_docdb_cluster.cluster.port
  sensitive = true
}
