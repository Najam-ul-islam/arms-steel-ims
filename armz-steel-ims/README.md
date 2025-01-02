# ArmzSteel Inventory Management System

ArmzSteel is a Steel Factory that produces various steel products. This repository contains the inventory management system software for ArmzSteel.

## Description

This software is designed to manage the inventory of steel products at ArmzSteel. It provides features such as tracking stock levels, managing orders, and generating reports.

## Installation

To install this software, follow these steps:

```bash
git clone https://github.com/your-username/armzsteel.git
cd armzsteel
# Install the required libraries
npm install 

# To run the inventory management system, use the following command:
npm run dev

# This software is built with Next.js 15.

# Contributing
# If you would like to contribute to this project, please follow these guidelines:

# Fork the repository

# Create a new branch (git checkout -b feature-branch)

# Make your changes

# Commit your changes (git commit -m 'Add feature')

# Push to the branch (git push origin feature-branch)

# Create a new Pull Request


# Database Migration
# To manage database migrations with Prisma ORM, follow these steps:
# 1- Install Prisma CLI (if not already installed):
npm install -g prisma

# 2- Initialize Prisma in your project (if not already initialized):

npx prisma init

# 3- Define your data model in prisma/schema.prisma

# 4- Create a new migration:
npx prisma migrate dev --name init
# Replace init with a meaningful name for your migration.

# 5- Apply the migration and generate the Prisma Client:

npx prisma migrate dev
npx prisma generate

# if you want to change the database configuration for your application you can do so here and in your
# prisma  schema.config file
# change the databse url
# change the database name


datasource db { provider = "sqlite" url = "file:./dev.db" }

# Here, "file:./dev.db" indicates that the SQLite database file dev.db is located in the root directory # of your project.