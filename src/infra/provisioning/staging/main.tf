terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "local" {
    path = "./terraform.tfstate"
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "julio"
}

module "vpc" {
  source      = "../modules/vpc"
  environment = var.environment
}

module "instance" {
  source         = "../modules/instance"
  environment    = var.environment
  vpc_id         = module.vpc.vpc_id
  vpc_cidr_block = module.vpc.vpc_cidr_block
  route_table_id = module.vpc.route_table_id
  subnets        = module.vpc.subnets
  instance_ami   = "ami-0c7217cdde317cfec"
  instance_type  = "t2.micro"
  volume_size    = 8
  volume_type    = "gp3"
}

module "rds" {
  source                  = "../modules/rds"
  environment             = var.environment
  vpc_id                  = module.vpc.vpc_id
  vpc_cidr_block          = module.vpc.vpc_cidr_block
  route_table_id          = module.vpc.route_table_id
  subnets                 = module.vpc.subnets
  db_subnet_group_name    = module.vpc.db_subnet_group_name
  max_allocated_storage   = 12
  allocated_storage       = 10
  backup_retention_period = 2
  storage_type            = "gp2"
  engine_version          = "8.0.34"
  instance_class          = "db.t3.micro"
}

module "mongodb" {
  source                  = "../modules/document_db"
  environment             = var.environment
  vpc_id                  = module.vpc.vpc_id
  vpc_cidr_block          = module.vpc.vpc_cidr_block
  route_table_id          = module.vpc.route_table_id
  subnets                 = module.vpc.subnets
  db_subnet_group_name    = module.vpc.db_subnet_group_name
  engine_version          = "5.0.0"
  instance_class          = "db.t3.medium"
  backup_retention_period = 2
}
