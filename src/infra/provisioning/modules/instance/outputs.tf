output "key_pair" {
  value     = tls_private_key.ssh-key.private_key_pem
  sensitive = true
}

output "elastic_ip" {
  value = aws_eip.instance_elastic_ip.public_ip
}
