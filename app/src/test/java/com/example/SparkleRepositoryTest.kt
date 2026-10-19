package com.example

import com.example.data.model.GigOpportunityType
import com.example.data.model.PostCategory
import com.example.data.repository.SparkleRepository
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class SparkleRepositoryTest {

    private lateinit var repository: SparkleRepository

    @Before
    fun setUp() {
        repository = SparkleRepository()
    }

    @Test
    fun testUniversitiesCatalogHasKenyanUniversities() {
        val universities = repository.universitiesList
        assertTrue("Catalog should contain Kenyan universities", universities.isNotEmpty())
        val uon = universities.find { it.shortName == "UoN" }
        assertNotNull("UoN should be present", uon)
        val ku = universities.find { it.shortName == "KU" }
        assertNotNull("KU should be present", ku)
        val strathmore = universities.find { it.shortName == "Strathmore" }
        assertNotNull("Strathmore should be present", strathmore)
    }

    @Test
    fun testPublishPostAddsToFeed() {
        val initialCount = repository.posts.value.size
        repository.addPost(
            content = "Looking for study group for Calculus II at Chiromo",
            category = PostCategory.ACADEMICS,
            isAnonymous = false
        )
        val posts = repository.posts.value
        assertEquals(initialCount + 1, posts.size)
        assertEquals("Looking for study group for Calculus II at Chiromo", posts.first().content)
        assertFalse(posts.first().isAnonymous)
    }

    @Test
    fun testPublishAnonymousPostHidesIdentity() {
        repository.addPost(
            content = "Anonymous confession about campus life",
            category = PostCategory.ANONYMOUS,
            isAnonymous = true
        )
        val latestPost = repository.posts.value.first()
        assertTrue(latestPost.isAnonymous)
        assertEquals("Anonymous Student", latestPost.authorName)
        assertEquals("anonymous", latestPost.authorId)
    }

    @Test
    fun testToggleLikePost() {
        val post = repository.posts.value.first()
        val initialLikes = post.likesCount
        val initialLiked = post.isLikedByMe

        repository.toggleLike(post.id)
        val updatedPost = repository.posts.value.first { it.id == post.id }
        assertEquals(!initialLiked, updatedPost.isLikedByMe)
        val expectedLikes = if (!initialLiked) initialLikes + 1 else initialLikes - 1
        assertEquals(expectedLikes, updatedPost.likesCount)
    }

    @Test
    fun testApplyForGigUpdatesStatusAndCreatesNotification() {
        val gig = repository.gigs.value.first()
        assertFalse(gig.hasApplied)
        val initialNotifs = repository.notifications.value.size

        repository.applyForGig(
            gigId = gig.id,
            coverNote = "I have 2 years of Android Kotlin experience",
            portfolioLink = "https://github.com/example/campus-portfolio",
            phone = "0712345678"
        )

        val updatedGig = repository.gigs.value.first { it.id == gig.id }
        assertTrue(updatedGig.hasApplied)
        assertEquals(initialNotifs + 1, repository.notifications.value.size)
    }

    @Test
    fun testToggleCommunityMembership() {
        val community = repository.communities.value.first()
        val wasJoined = community.isJoined
        val initialMembers = community.membersCount

        repository.toggleCommunityMembership(community.id)
        val updated = repository.communities.value.first { it.id == community.id }
        assertEquals(!wasJoined, updated.isJoined)
        val expectedCount = if (!wasJoined) initialMembers + 1 else initialMembers - 1
        assertEquals(expectedCount, updated.membersCount)
    }

    @Test
    fun testToggleEventRegistration() {
        val event = repository.events.value.first()
        val wasRegistered = event.isRegistered
        val initialAttendees = event.attendeeCount

        repository.toggleEventRegistration(event.id)
        val updated = repository.events.value.first { it.id == event.id }
        assertEquals(!wasRegistered, updated.isRegistered)
        val expectedAttendees = if (!wasRegistered) initialAttendees + 1 else initialAttendees - 1
        assertEquals(expectedAttendees, updated.attendeeCount)
    }

    @Test
    fun testSendMessageUpdatesConversationThread() {
        val conversation = repository.conversations.value.first()
        val initialMessageCount = conversation.messages.size

        repository.sendMessage(conversation.id, "Hey, see you at the hackathon venue!")
        val updatedConv = repository.conversations.value.first { it.id == conversation.id }
        assertEquals(initialMessageCount + 1, updatedConv.messages.size)
        assertEquals("Hey, see you at the hackathon venue!", updatedConv.lastMessage)
    }
}
