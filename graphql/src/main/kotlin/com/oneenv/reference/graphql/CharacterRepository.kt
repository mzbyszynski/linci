package com.linci.reference.graphql

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface CharacterRepository : CrudRepository<Character, Long>