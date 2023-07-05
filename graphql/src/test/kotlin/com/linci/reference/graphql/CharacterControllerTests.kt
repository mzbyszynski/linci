package com.linci.reference.graphql

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.graphql.test.tester.GraphQlTester

@GraphQlTest
class CharacterControllerTests @Autowired constructor(
    private val graphqlTester: GraphQlTester
) {

    @MockkBean
    lateinit var characterRepository: CharacterRepository

    @Nested
    inner class CharacterByIdQuery {
        @Test
        fun `When given a valid id return Character`() {
            val character = Character("Test Character")
            every { characterRepository.findByIdOrNull(0) } returns character
            graphqlTester.documentName("characterGet")
                .variable("id", "0")
                .execute()
                .path("characterById")
                .matchesJson(
                    """
                    {
                        "id": "0",
                        "name": "Test Character"
                    }
                """
                )
        }

        @Test
        fun `When given an invalid id return null`() {
            graphqlTester.documentName("characterGet")
                .variable("id", "invalid")
                .execute()
                .path("characterById")
                .valueIsNull()
        }
    }

    @Nested
    inner class AddCharacterMutation {
        @Test
        fun `When addCharacter return Character`() {
            val character = Character("Test Character")
            every { characterRepository.save(character) } returns character
            graphqlTester.documentName("characterSave")
                .variable("name", character.name)
                .execute()
                .path("addCharacter")
                .matchesJson(
                    """
                    {
                        "id": "0",
                        "name": "Test Character"
                    }
                """
                )
        }
    }
}