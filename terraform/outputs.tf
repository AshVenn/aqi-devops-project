output "master_public_ip" {
  value = aws_instance.aqi_master.public_ip
}

output "worker_public_ip" {
  value = aws_instance.aqi_worker.public_ip
}

output "master_private_ip" {
  value = aws_instance.aqi_master.private_ip
}