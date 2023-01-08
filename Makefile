################################################################################
# MAKEFILE v1.0.0
################################################################################

# Set default shell
SHELL := /bin/sh

########################################
# DEPENDENCIES
########################################

# Used to check if node is installed
NODEJS := $(shell node --version 2>/dev/null)
# Used to check if docker is installed
DOCKER := $(shell docker --version 2>/dev/null)

########################################
# VARIABLES
########################################

####################
# GENERAL
####################

# Organisation that owns the project
ORG := $(shell cat package.json | grep \"organisation\" | head -1 |\
	sed -r 's/(organisation|[":, ])//g')
# Group inside the organisation where the project is categorised
GROUP := $(shell cat package.json | grep \"group\" | head -1 | \
	sed -r 's/(group|[":, ])//g')
# Project name
PROJECT := $(shell cat package.json | grep \"name\" | head -1 | \
	sed -r 's/(name|[":, ])//g')
# Project version
VERSION := $(shell cat package.json | grep \"version\" | head -1 | \
	sed -r 's/(version|[":, ])//g')
# Project license
LICENSE := $(shell cat package.json | grep \"license\" | head -1 | \
	sed -r 's/(license|[":,])//g')

####################
# DOCKER
####################

# Project's docker image name
DOCKER_IMAGE_NAME := $(ORG)/$(GROUP)/$(PROJECT)
# Project's docker image actual tag
DOCKER_IMAGE_TAG := v$(VERSION)
# Project's docker image
DOCKER_IMAGE := $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG)

####################
# NODEJS
####################

# Project's source files
SRC_FILES:=$(shell find src/ -type f)
# Project's test files
TEST_FILES:=$(shell find test/ -type f)

########################################
# BASIC RULES
########################################

# Nothing is done by default
.PHONY: default
default: test

# Installs the program
.PHONY: install
install:
	@echo "Not possible to install this program.";

# Prepares the code ready to distribute
dist: $(SRC_FILES) package.json | node_modules check_node_env
	@echo "Nothing to do.";

# Starts execution
.PHONY: start
start: $(SRC_FILES) package.json | node_modules check_node_env
	@npm start $(ARGS)

# Executes tests
.PHONY: test
test: $(SRC_FILES) $(TEST_FILES) package.json | node_modules \
	check_node_env
	@npm test

# Test alias
.PHONY: check
check: test

# Test coverage report
.PHONY: coverage
coverage: $(SRC_FILES) $(TEST_FILES) package.json | node_modules \
	check_node_env
	@npm run coverage

# Executes linter
.PHONY: lint
lint: $(SRC_FILES) $(TEST_FILES) package.json | node_modules \
	check_node_env
	@npm run lint

# Generates documentation
doc: $(SRC_FILES) package.json | node_modules check_node_env
	@npm run doc

# Clean files
.PHONY: clean
clean:
	@echo "Check files to remove with 'git clean -xdn'"
	@echo "Remove files with 'git clean -xdf'"

# Prints the project's version
.PHONY: version
version: package.json
	@echo $(PROJECT) v$(VERSION)

# Prints the project information
.PHONY: info
info: package.json
	@echo $(PROJECT) \($(GROUP)\) at $(ORG) is under license: $(LICENSE)

########################################
# DOCKER RULES
########################################

# Check if docker is installed
.PHONY: installed_nodejs
installed_docker:
	@if [ -z "$(DOCKER)" ] ; then \
		echo "Docker is required"; \
		exit 1; \
	fi

# Builds the docker image
.PHONY: dckr_img
dckr_img: Dockerfile | installed_docker
	@docker build \
		-t $(DOCKER_IMAGE) \
		.

# Builds the docker image
.PHONY: dckr_img_ready
dckr_img_ready: | installed_docker
	@if [`docker image ls $(DOCKER_IMAGE) --format "{{.Repository}}" | \
		wc -l` -eq 0 ]; then \
		$(MAKE) dckr_img; \
	fi

# Builds the docker image
.PHONY: dckr_img_rm
dckr_img_rm: | installed_docker
	@docker image rm $(DOCKER_IMAGE)

########################################
# NODEJS RULES
########################################

# Check NODE_ENV is correctly set
.PHONY: check_node_env
check_node_env:
	@case "$(NODE_ENV)" in \
	production|development|test) \
		;; \
	*) \
		echo "Invalid NODE_ENV: '$(NODE_ENV)'."; \
		echo "Valid values are 'production', 'test' and 'development'."; \
		exit 1;\
	esac

# Check if nodejs is installed
.PHONY: installed_nodejs
installed_nodejs:
	@if [ -z "$(NODEJS)" ] ; then \
		echo "Nodejs is required"; \
		exit 1; \
	fi

# Installs required dependencies
node_modules: package.json | installed_nodejs
	@case "$(NODE_ENV)" in \
		production)\
			npm install --production; \
			;;\
		*)\
			npm install; \
		esac
	@touch -m $@
