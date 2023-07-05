package com.linci.reference.graphql

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.data.repository.findByIdOrNull

// Not sure about these tests. Am I just testing JPA?
// Maybe graphql tests should just not mock jpa?
@DataJpaTest
class CharacterRepositoryTests @Autowired constructor(
    val entityManager: TestEntityManager,
    val characterRepository: CharacterRepository
) {

    @Test
    fun `When findByIdOrNull then return Character`() {
        val character = Character("Test Character")
        entityManager.persist(character)
        entityManager.flush()
        val found = characterRepository.findByIdOrNull(character.id)
        found shouldBe character
    }

    @Test
    fun `When save then return Character`() {
        val character = Character("Test Character")
        val result = characterRepository.save(character)
        result shouldBe character
    }

}