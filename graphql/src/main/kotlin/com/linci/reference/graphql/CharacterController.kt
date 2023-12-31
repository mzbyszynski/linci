package com.linci.reference.graphql

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import java.util.*

@Controller
class CharacterController(
    val repository: CharacterRepository
) {
    @QueryMapping
    fun characterById(@Argument id: String): Character? {
        val longId = id.toLongOrNull()
        if (longId != null) {
            return repository.findByIdOrNull(longId)
        }
        return null
    }

    @MutationMapping
    fun addCharacter(@Argument character: CharacterInput): Character {
        val entity = Character(name = character.name)
        return repository.save(entity)
    }
}