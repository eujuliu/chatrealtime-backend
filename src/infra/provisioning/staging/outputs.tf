output "ec2_key_pair_pem" {
  value     = module.instance.key_pair
  sensitive = true
}

output "mdb_username" {
  value = module.mongodb.username
}

output "mdb_password" {
  value     = module.mongodb.password
  sensitive = true
}

output "mdb_port" {
  value     = module.mongodb.port
  sensitive = true
}

output "rds_name" {
  value = module.rds.db_name
}

output "rds_username" {
  value = module.rds.username
}

output "rds_password" {
  value     = module.rds.password
  sensitive = true
}

output "rds_port" {
  value     = module.rds.port
  sensitive = true
}

output "rds_address" {
  value     = module.rds.address
  sensitive = true
}
