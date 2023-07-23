import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.1.1"
	id("io.spring.dependency-management") version "1.1.0"
	id("com.google.cloud.tools.jib") version "3.3.2"
	kotlin("jvm") version "1.8.22"
	kotlin("plugin.spring") version "1.8.22"
	kotlin("plugin.jpa") version "1.8.22"
	jacoco
}

group = "com.linci.reference"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

jacoco {
	toolVersion = "0.8.10"
}


jib {
	to {
		image = "linci/graphql"
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-graphql")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-test") {
		exclude(module = "mockito-core")
	}
	testImplementation("org.junit.jupiter:junit-jupiter-api")
	testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
	testImplementation("com.ninja-squad:springmockk:4.0.0")
	testImplementation("org.springframework:spring-webflux")
	testImplementation("org.springframework.graphql:spring-graphql-test")
	testImplementation("io.kotest:kotest-assertions-core:5.6.2")
	runtimeOnly("com.h2database:h2")
}

tasks.named("build") {
	dependsOn(":jibDockerBuild")
}

tasks.named("check") {
	dependsOn(":jacocoTestCoverageVerification")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs += "-Xjsr305=strict"
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<JacocoReport> {
	afterEvaluate {
		classDirectories.setFrom(
			files(classDirectories.files.map {
				fileTree(it).apply {
					exclude("**/GraphqlServerApplication**")
				}
			})
		)
	}
}

tasks.withType<JacocoCoverageVerification> {
	violationRules {
		rule {
			limit {
				minimum = "1.0".toBigDecimal()
			}
		}
	}
	afterEvaluate {
		classDirectories.setFrom(
			files(classDirectories.files.map {
				fileTree(it).apply {
					exclude("**/GraphqlServerApplication**")
				}
			})
		)
	}
}