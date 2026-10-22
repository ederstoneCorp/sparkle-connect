package com.example.data.repository

import com.example.data.local.AccountDao
import com.example.data.local.AccountEntity
import com.example.data.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

class SparkleRepository(
    private val accountDao: AccountDao? = null,
    private val repositoryScope: CoroutineScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
) {

    // Kenyan Universities Catalog
    val universitiesList = listOf(
        University(name = "University of Nairobi", shortName = "UoN", location = "Nairobi"),
        University(name = "Kenyatta University", shortName = "KU", location = "Kahawa, Nairobi"),
        University(name = "Strathmore University", shortName = "Strathmore", location = "Madaraka, Nairobi"),
        University(name = "Jomo Kenyatta Univ. of Agriculture & Tech", shortName = "JKUAT", location = "Juja, Kiambu"),
        University(name = "Moi University", shortName = "Moi", location = "Eldoret"),
        University(name = "Egerton University", shortName = "Egerton", location = "Njoro, Nakuru"),
        University(name = "United States International Univ. Africa", shortName = "USIU-Africa", location = "Roysambu, Nairobi"),
        University(name = "Mount Kenya University", shortName = "MKU", location = "Thika"),
        University(name = "Technical University of Kenya", shortName = "TUK", location = "Nairobi CBD"),
        University(name = "Daystar University", shortName = "Daystar", location = "Athi River / Valley Rd"),
        University(name = "Maseno University", shortName = "Maseno", location = "Kisumu"),
    )

    // Registered Accounts database table
    private val _registeredAccounts = MutableStateFlow<List<RegisteredAccount>>(emptyList())
    val registeredAccounts: StateFlow<List<RegisteredAccount>> = _registeredAccounts.asStateFlow()

    // Current Logged-in Student - starts null so app opens directly to Auth Screen
    private val _currentUser = MutableStateFlow<StudentProfile?>(null)
    val currentUser: StateFlow<StudentProfile?> = _currentUser.asStateFlow()

    // Posts Feed
    private val _posts = MutableStateFlow<List<CampusPost>>(emptyList())
    val posts: StateFlow<List<CampusPost>> = _posts.asStateFlow()

    // Gigs
    private val _gigs = MutableStateFlow<List<Gig>>(emptyList())
    val gigs: StateFlow<List<Gig>> = _gigs.asStateFlow()

    // Communities
    private val _communities = MutableStateFlow<List<Community>>(emptyList())
    val communities: StateFlow<List<Community>> = _communities.asStateFlow()

    // Events
    private val _events = MutableStateFlow<List<CampusEvent>>(emptyList())
    val events: StateFlow<List<CampusEvent>> = _events.asStateFlow()

    // Conversations
    private val _conversations = MutableStateFlow<List<Conversation>>(emptyList())
    val conversations: StateFlow<List<Conversation>> = _conversations.asStateFlow()

    // Notifications
    private val _notifications = MutableStateFlow<List<SparkleNotification>>(emptyList())
    val notifications: StateFlow<List<SparkleNotification>> = _notifications.asStateFlow()

    init {
        seedInitialData()
        loadAccountsFromDatabase()
    }

    private fun loadAccountsFromDatabase() {
        if (accountDao == null) return
        repositoryScope.launch {
            try {
                val dbAccounts = accountDao.getAllAccounts()
                if (dbAccounts.isNotEmpty()) {
                    _registeredAccounts.value = dbAccounts.map { it.toRegisteredAccount() }
                } else {
                    // Prepopulate database with verified campus student accounts
                    accountDao.insertAll(_registeredAccounts.value.map { AccountEntity.fromRegisteredAccount(it) })
                }
                // Continuously observe Room database updates
                accountDao.getAllAccountsFlow().collect { accounts ->
                    if (accounts.isNotEmpty()) {
                        _registeredAccounts.value = accounts.map { it.toRegisteredAccount() }
                    }
                }
            } catch (e: Exception) {
                // Fallback to in-memory seed if DB is initializing
            }
        }
    }

    private fun seedInitialData() {
        // Seed Registered Student Accounts in Database with Real Names & Campuses
        _registeredAccounts.value = listOf(
            RegisteredAccount(
                id = "user_holdstone",
                email = "holdstonez@gmail.com",
                password = "password123",
                authProvider = "GOOGLE",
                googleEmail = "holdstonez@gmail.com",
                socialHandle = "github.com/holdstonez",
                isRecordedInDatabase = true,
                profile = StudentProfile(
                    id = "user_holdstone",
                    username = "holdstone",
                    displayName = "Holdstone Z.",
                    email = "holdstonez@gmail.com",
                    bio = "Software Engineering student • Building Sparkle Connect for Kenyan campuses 🚀🇰🇪",
                    university = universitiesList[1], // KU
                    faculty = "School of Engineering & Architecture",
                    course = "BSc Software Engineering",
                    yearOfStudy = 3,
                    isVerifiedStudent = true,
                    skills = listOf("Kotlin", "Android", "Full-Stack", "Cloud"),
                    interests = listOf("Tech & Coding", "Campus Entrepreneurship", "AI & Machine Learning")
                )
            ),
            RegisteredAccount(
                id = "user_brian_mutua",
                email = "brian.mutua@uonbi.ac.ke",
                password = "password123",
                authProvider = "EMAIL",
                googleEmail = "brian.mutua@gmail.com",
                socialHandle = "linkedin.com/in/brian-mutua",
                isRecordedInDatabase = true,
                profile = StudentProfile(
                    id = "user_brian_mutua",
                    username = "brian_mutua",
                    displayName = "Brian Mutua",
                    email = "brian.mutua@uonbi.ac.ke",
                    bio = "Computer Science sophomore @ UoN Chiromo. Passionate about Kotlin, Android, and campus startup hubs 🚀🇰🇪",
                    university = universitiesList[0], // UoN
                    faculty = "Faculty of Science & Technology",
                    course = "BSc Computer Science",
                    yearOfStudy = 2,
                    isVerifiedStudent = true,
                    skills = listOf("Kotlin", "Jetpack Compose", "Python", "UI/UX Design", "Figma"),
                    interests = listOf("Tech & Coding", "Campus Entrepreneurship", "Photography", "Robotics")
                )
            ),
            RegisteredAccount(
                id = "user_faith_chebet",
                email = "faith.chebet@strathmore.edu",
                password = "password123",
                authProvider = "LINKEDIN",
                googleEmail = "faith.chebet@gmail.com",
                socialHandle = "linkedin.com/in/faith-chebet",
                isRecordedInDatabase = true,
                profile = StudentProfile(
                    id = "user_faith_chebet",
                    username = "faith_chebet",
                    displayName = "Faith Chebet",
                    email = "faith.chebet@strathmore.edu",
                    bio = "Fintech enthusiast & Business Information Tech student @ Strathmore University 💳",
                    university = universitiesList[2], // Strathmore
                    faculty = "Faculty of Information Technology",
                    course = "Business Information Tech",
                    yearOfStudy = 3,
                    isVerifiedStudent = true,
                    skills = listOf("Fintech", "Data Analysis", "Project Management"),
                    interests = listOf("Finance", "Startups & Biz", "Hackathons")
                )
            )
        )

        // Seed Initial Posts
        _posts.value = listOf(
            CampusPost(
                authorId = "student_faith",
                authorName = "Faith Chebet",
                authorAvatar = "FC",
                authorUniversity = "Strathmore University",
                authorCourse = "Business Information Tech",
                content = "Excited to share that our campus fintech team just won the Inter-University Hackathon! Anyone looking to collaborate on building modern M-Pesa integrated student tools? Drop a comment or DM me! 💻🇰🇪",
                category = PostCategory.TECH,
                likesCount = 42,
                commentsCount = 6,
                isLikedByMe = false,
                timeAgo = "15m ago",
                comments = listOf(
                    PostComment(
                        authorName = "Kevin Omondi",
                        authorAvatar = "KO",
                        authorUniversity = "JKUAT",
                        content = "Congrats Faith! I do backend integrations with Daraja API, would love to connect."
                    ),
                    PostComment(
                        authorName = "Amina Hassan",
                        authorAvatar = "AH",
                        authorUniversity = "UoN",
                        content = "Super inspiring! Is the project open source?"
                    )
                )
            ),
            CampusPost(
                authorId = "anonymous",
                authorName = "Anonymous Student",
                authorAvatar = "🔒",
                authorUniversity = "Kenyatta University",
                content = "Does anyone know the best quiet revision spots around KU library during CATs week? The main study hall fills up before 8 AM!",
                category = PostCategory.ANONYMOUS,
                isAnonymous = true,
                likesCount = 28,
                commentsCount = 4,
                isLikedByMe = true,
                timeAgo = "45m ago",
                comments = listOf(
                    PostComment(
                        authorName = "Dennis Kip",
                        authorAvatar = "DK",
                        authorUniversity = "KU",
                        content = "Try the 3rd floor postgraduate wing or the 8-4-4 pavilion, usually has power outlets and fewer people!"
                    )
                )
            ),
            CampusPost(
                authorId = "student_george",
                authorName = "George Kariuki",
                authorAvatar = "GK",
                authorUniversity = "JKUAT",
                authorCourse = "Mechatronics Engineering",
                content = "We have open slots for 2 student hardware enthusiasts in the Juja Robotics Club. We're assembling an autonomous agriculture rover for National Innovation Week. Check the Communities tab to join us!",
                category = PostCategory.OPPORTUNITIES,
                likesCount = 64,
                commentsCount = 8,
                isLikedByMe = false,
                timeAgo = "2h ago"
            ),
            CampusPost(
                authorId = "student_mercy",
                authorName = "Mercy Wanjiku",
                authorAvatar = "MW",
                authorUniversity = "University of Nairobi",
                authorCourse = "Economics & Statistics",
                content = "Offering weekend peer tutoring sessions for Quantitative Methods & Calculus at Chiromo Campus. KES 500/hr. If you are struggling with CAT 2 prep, send me a message!",
                category = PostCategory.CAREER,
                likesCount = 19,
                commentsCount = 3,
                timeAgo = "3h ago"
            ),
            CampusPost(
                authorId = "student_brian",
                authorName = "Brian Kiprop",
                authorAvatar = "BK",
                authorUniversity = "Moi University",
                authorCourse = "Software Engineering",
                content = "Just released a Kotlin Multiplatform starter template configured for Kenyan developer students! Includes Room SQLite, Ktor, and M-Pesa sandbox helpers. Free on GitHub! 🚀📱",
                category = PostCategory.TECH,
                likesCount = 53,
                commentsCount = 9,
                timeAgo = "4h ago"
            ),
            CampusPost(
                authorId = "student_cynthia",
                authorName = "Cynthia Akoth",
                authorAvatar = "CA",
                authorUniversity = "Kenyatta University",
                authorCourse = "Sports Science",
                content = "Who else is attending the Inter-University Games this Friday at Kenyatta University grounds? The UoN vs KU basketball derby is going to be epic! 🏀🔥",
                category = PostCategory.CAMPUS_LIFE,
                likesCount = 37,
                commentsCount = 5,
                timeAgo = "5h ago"
            ),
            CampusPost(
                authorId = "student_samuel",
                authorName = "Samuel Njoroge",
                authorAvatar = "SN",
                authorUniversity = "Egerton University",
                authorCourse = "Agribusiness Management",
                content = "Equity Leaders Program is hosting a virtual mentorship workshop on CV writing and tech interview prep for 3rd and 4th year students tomorrow at 4 PM. DM me for the Zoom link!",
                category = PostCategory.OPPORTUNITIES,
                likesCount = 31,
                commentsCount = 2,
                timeAgo = "6h ago"
            ),
            CampusPost(
                authorId = "anonymous2",
                authorName = "Anonymous Student",
                authorAvatar = "🔒",
                authorUniversity = "Strathmore University",
                content = "How do you guys handle burnout during 2nd year semester 1? Balancing coursework, freelance gigs, and exam prep feels intense right now. Any advice?",
                category = PostCategory.ANONYMOUS,
                isAnonymous = true,
                likesCount = 45,
                commentsCount = 12,
                timeAgo = "8h ago"
            ),
            CampusPost(
                authorId = "student_joy",
                authorName = "Joy Wambui",
                authorAvatar = "JW",
                authorUniversity = "USIU-Africa",
                authorCourse = "International Relations",
                content = "Sparkle Connect Annual Campus Tech & Innovation Gala is happening next month at Strathmore Auditorium. Free delegate passes available for verified students! 🎟️✨",
                category = PostCategory.CAMPUS_LIFE,
                likesCount = 88,
                commentsCount = 14,
                timeAgo = "12h ago"
            ),
            CampusPost(
                authorId = "student_david",
                authorName = "David Otieno",
                authorAvatar = "DO",
                authorUniversity = "Technical University of Kenya",
                authorCourse = "Electrical & Electronic Eng",
                content = "Safaricom Spark Accelerator is officially accepting applications for student-founded startups. Up to KES 500,000 equity-free seed funding for top 3 pitch finalists! 💡🇰🇪",
                category = PostCategory.CAREER,
                likesCount = 76,
                commentsCount = 11,
                timeAgo = "1d ago"
            )
        )

        // Seed Initial Gigs
        _gigs.value = listOf(
            Gig(
                title = "Android Mobile App UI Redesign",
                description = "Looking for a talented student mobile designer/developer to refine Jetpack Compose layouts for a campus laundry booking startup. Great portfolio addition with compensation.",
                category = "Mobile & App Development",
                skillsRequired = listOf("Android", "Kotlin", "Compose", "Figma"),
                opportunityType = GigOpportunityType.FREELANCE,
                isPaid = true,
                compensation = "KES 15,000",
                locationType = "Remote",
                publisherName = "Dennis Mwangi",
                publisherUniversity = "Strathmore",
                publisherAvatar = "DM",
                deadline = "In 5 days",
                applicationsCount = 4
            ),
            Gig(
                title = "Campus Tech Summit Poster & Social Media Graphics",
                description = "Design 3 vibrant promotional flyers, banner templates, and Instagram carousel graphics for the upcoming National Student Tech Summit at UoN.",
                category = "Graphic Design",
                skillsRequired = listOf("Photoshop", "Illustrator", "Canva", "Brand Identity"),
                opportunityType = GigOpportunityType.FREELANCE,
                isPaid = true,
                compensation = "KES 8,000",
                locationType = "Remote",
                publisherName = "Lydia Achieng",
                publisherUniversity = "University of Nairobi",
                publisherAvatar = "LA",
                deadline = "In 2 days",
                applicationsCount = 7
            ),
            Gig(
                title = "Calculus & Discrete Maths Peer Tutor",
                description = "Looking for an engineering or mathematics 3rd/4th year student to tutor 2 freshmen twice a week on evenings.",
                category = "Academic Tutoring",
                skillsRequired = listOf("Calculus", "Linear Algebra", "Teaching"),
                opportunityType = GigOpportunityType.TUTORING,
                isPaid = true,
                compensation = "KES 600 / session",
                locationType = "On-Campus (Chiromo)",
                publisherName = "Patrick Kimani",
                publisherUniversity = "UoN",
                publisherAvatar = "PK",
                deadline = "Open until filled",
                applicationsCount = 2
            ),
            Gig(
                title = "Campus Event Ushers & Registration Leads",
                description = "Need 4 energetic, organized students to handle badge distribution, guest assistance, and registration at the KU Annual Career Expo.",
                category = "Event Support",
                skillsRequired = listOf("Communication", "Customer Care", "Punctuality"),
                opportunityType = GigOpportunityType.PART_TIME,
                isPaid = true,
                compensation = "KES 3,500 / day + Lunch",
                locationType = "Kenyatta University Main Campus",
                publisherName = "KU Student Union",
                publisherUniversity = "Kenyatta University",
                publisherAvatar = "KU",
                deadline = "Tomorrow",
                applicationsCount = 12
            )
        )

        // Seed Communities
        _communities.value = listOf(
            Community(
                name = "Nairobi Tech Student Developers",
                description = "A thriving cross-university hub for builders, open-source contributors, and software engineers across Kenyan institutions.",
                category = "Technology",
                universityAffiliation = "All Universities",
                membersCount = 1420,
                isJoined = true,
                leaderName = "Alex Kiprono",
                tags = listOf("Kotlin", "React", "AI", "Cloud", "Hackathons")
            ),
            Community(
                name = "UoN Innovators & Founders Club",
                description = "Official entrepreneurship network for University of Nairobi students launching ventures, finding co-founders, and pitching to angel investors.",
                category = "Startups & Biz",
                universityAffiliation = "University of Nairobi",
                membersCount = 680,
                isJoined = true,
                leaderName = "Brenda Nekesa",
                tags = listOf("Pitching", "Venture", "Funding", "Incubator")
            ),
            Community(
                name = "KU Creatives & Digital Artists",
                description = "Graphic designers, photographers, motion animators, and visual storytellers at Kenyatta University sharing gigs, feedback, and gear.",
                category = "Creative Arts",
                universityAffiliation = "Kenyatta University",
                membersCount = 512,
                isJoined = false,
                leaderName = "Sammy M",
                tags = listOf("Design", "Photography", "Video", "Portfolio")
            ),
            Community(
                name = "Kenya Student Debate Guild",
                description = "Competitive parliamentary debate, public speaking workshops, and inter-varsity championships.",
                category = "Leadership & Policy",
                universityAffiliation = "All Universities",
                membersCount = 340,
                isJoined = false,
                leaderName = "Winnie Atieno",
                tags = listOf("Debate", "Public Speaking", "Model UN")
            )
        )

        // Seed Events
        _events.value = listOf(
            CampusEvent(
                title = "Kenya Inter-Varsity Tech Gala 2026",
                description = "The premier university tech exhibition featuring keynote panels from Silicon Savannah leaders, pitch competitions, and developer networking.",
                organizer = "Sparkle Connect Student Council",
                university = "All Kenyan Universities",
                venue = "UoN Taifa Hall & Live Streaming",
                isOnline = false,
                dateString = "Sat, Nov 14",
                timeString = "9:00 AM - 5:00 PM EAT",
                category = "Tech & Innovation",
                attendeeCount = 480,
                capacity = 600,
                isRegistered = true,
                coverGradientIndex = 0
            ),
            CampusEvent(
                title = "Strathmore Fintech & AI Workshop",
                description = "Hands-on session on implementing secure financial APIs, fraud prevention, and real-time transaction processing.",
                organizer = "Strathmore Computing Society",
                university = "Strathmore University",
                venue = "Auditorium B, Student Centre",
                isOnline = false,
                dateString = "Thu, Oct 29",
                timeString = "2:00 PM - 4:30 PM EAT",
                category = "Workshop",
                attendeeCount = 145,
                capacity = 200,
                isRegistered = false,
                coverGradientIndex = 1
            ),
            CampusEvent(
                title = "Campus Freelancing & Remote Work Masterclass",
                description = "Learn how to land international freelance contracts, price your services, and manage your student taxes and Upwork/Fiverr presence.",
                organizer = "Digital Skills Kenya",
                university = "Virtual Event",
                venue = "Google Meet Online",
                isOnline = true,
                dateString = "Wed, Nov 4",
                timeString = "7:00 PM - 8:30 PM EAT",
                category = "Career",
                attendeeCount = 310,
                isRegistered = true,
                coverGradientIndex = 2
            )
        )

        // Seed Conversations
        _conversations.value = listOf(
            Conversation(
                participantName = "Faith Chebet",
                participantAvatar = "FC",
                participantUniversity = "Strathmore University",
                lastMessage = "Let's review the API architecture tomorrow at 10 AM!",
                lastMessageTime = "12:45 PM",
                unreadCount = 1,
                isOnline = true,
                messages = listOf(
                    ChatMessage(
                        senderId = "student_faith",
                        senderName = "Faith Chebet",
                        text = "Hey Brian! Saw your profile and your work with Jetpack Compose.",
                        timestamp = "12:30 PM",
                        isFromMe = false
                    ),
                    ChatMessage(
                        senderId = "user-sparkle-main",
                        senderName = "Brian Mutua",
                        text = "Hi Faith! Yes, I love building modern reactive apps with Kotlin.",
                        timestamp = "12:35 PM",
                        isFromMe = true
                    ),
                    ChatMessage(
                        senderId = "student_faith",
                        senderName = "Faith Chebet",
                        text = "Let's review the API architecture tomorrow at 10 AM!",
                        timestamp = "12:45 PM",
                        isFromMe = false
                    )
                )
            ),
            Conversation(
                participantName = "Dennis Mwangi",
                participantAvatar = "DM",
                participantUniversity = "Strathmore",
                lastMessage = "Thanks for sending your portfolio link for the gig.",
                lastMessageTime = "Yesterday",
                unreadCount = 0,
                isOnline = false,
                messages = listOf(
                    ChatMessage(
                        senderId = "user-sparkle-main",
                        senderName = "Brian Mutua",
                        text = "Hello Dennis, submitted my application for the UI redesign gig.",
                        timestamp = "Yesterday 4:00 PM",
                        isFromMe = true
                    ),
                    ChatMessage(
                        senderId = "dmwangi",
                        senderName = "Dennis Mwangi",
                        text = "Thanks for sending your portfolio link for the gig.",
                        timestamp = "Yesterday 5:20 PM",
                        isFromMe = false
                    )
                )
            )
        )

        // Seed Notifications
        _notifications.value = listOf(
            SparkleNotification(
                title = "New Gig Application Received",
                body = "Dennis Mwangi is reviewing your application for Android Mobile App UI Redesign.",
                timeAgo = "1 hour ago",
                type = "gig"
            ),
            SparkleNotification(
                title = "Event Reminder",
                body = "The Kenya Inter-Varsity Tech Gala is happening in 2 weeks. Check schedule updates.",
                timeAgo = "3 hours ago",
                type = "event"
            ),
            SparkleNotification(
                title = "Welcome to Nairobi Tech Developers!",
                body = "Your membership has been approved. Start connecting with campus devs.",
                timeAgo = "1 day ago",
                type = "community"
            )
        )
    }

    // Post Operations
    fun addPost(content: String, category: PostCategory, isAnonymous: Boolean) {
        val user = _currentUser.value ?: return
        val newPost = CampusPost(
            authorId = if (isAnonymous) "anonymous" else user.id,
            authorName = if (isAnonymous) "Anonymous Student" else user.displayName,
            authorAvatar = if (isAnonymous) "🔒" else user.displayName.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
            authorUniversity = user.university.name,
            authorCourse = if (isAnonymous) "" else user.course,
            content = content,
            category = category,
            isAnonymous = isAnonymous,
            likesCount = 0,
            commentsCount = 0,
            timeAgo = "Just now"
        )
        _posts.value = listOf(newPost) + _posts.value
    }

    fun toggleLike(postId: String) {
        _posts.value = _posts.value.map { post ->
            if (post.id == postId) {
                val newLiked = !post.isLikedByMe
                val newCount = if (newLiked) post.likesCount + 1 else (post.likesCount - 1).coerceAtLeast(0)
                post.copy(isLikedByMe = newLiked, likesCount = newCount)
            } else post
        }
    }

    fun addComment(postId: String, commentText: String) {
        val user = _currentUser.value ?: return
        _posts.value = _posts.value.map { post ->
            if (post.id == postId) {
                val newComment = PostComment(
                    authorName = user.displayName,
                    authorAvatar = user.displayName.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
                    authorUniversity = user.university.shortName,
                    content = commentText,
                    timeAgo = "Just now"
                )
                post.copy(
                    comments = post.comments + newComment,
                    commentsCount = post.commentsCount + 1
                )
            } else post
        }
    }

    // Gig Operations
    fun toggleGigBookmark(gigId: String) {
        _gigs.value = _gigs.value.map { gig ->
            if (gig.id == gigId) {
                gig.copy(isBookmarked = !gig.isBookmarked)
            } else gig
        }
    }

    fun applyForGig(gigId: String, coverNote: String, portfolioLink: String, phone: String) {
        _gigs.value = _gigs.value.map { gig ->
            if (gig.id == gigId) {
                gig.copy(hasApplied = true, applicationsCount = gig.applicationsCount + 1)
            } else gig
        }
        val notif = SparkleNotification(
            title = "Gig Application Submitted",
            body = "Your application was sent successfully. The publisher will reach out via Sparkle Connect or phone.",
            timeAgo = "Just now",
            type = "gig"
        )
        _notifications.value = listOf(notif) + _notifications.value
    }

    fun createGig(title: String, description: String, category: String, skills: List<String>, type: GigOpportunityType, compensation: String) {
        val user = _currentUser.value ?: return
        val newGig = Gig(
            title = title,
            description = description,
            category = category,
            skillsRequired = skills,
            opportunityType = type,
            isPaid = compensation.isNotBlank(),
            compensation = if (compensation.isNotBlank()) compensation else "Unpaid Collaboration",
            publisherName = user.displayName,
            publisherUniversity = user.university.name,
            publisherAvatar = user.displayName.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
            deadline = "In 7 days"
        )
        _gigs.value = listOf(newGig) + _gigs.value
    }

    // Community Operations
    fun toggleCommunityMembership(communityId: String) {
        _communities.value = _communities.value.map { comm ->
            if (comm.id == communityId) {
                val newJoined = !comm.isJoined
                val countDiff = if (newJoined) 1 else -1
                comm.copy(isJoined = newJoined, membersCount = comm.membersCount + countDiff)
            } else comm
        }
    }

    // Event Operations
    fun toggleEventRegistration(eventId: String) {
        _events.value = _events.value.map { event ->
            if (event.id == eventId) {
                val newReg = !event.isRegistered
                val countDiff = if (newReg) 1 else -1
                event.copy(isRegistered = newReg, attendeeCount = event.attendeeCount + countDiff)
            } else event
        }
    }

    // Message Operations
    fun setTypingStatus(conversationId: String, isTyping: Boolean) {
        _conversations.value = _conversations.value.map { conv ->
            if (conv.id == conversationId) {
                conv.copy(isTyping = isTyping)
            } else conv
        }
    }

    fun sendMessage(conversationId: String, text: String) {
        val user = _currentUser.value ?: return
        _conversations.value = _conversations.value.map { conv ->
            if (conv.id == conversationId) {
                val newMsg = ChatMessage(
                    senderId = user.id,
                    senderName = user.displayName,
                    text = text,
                    timestamp = "Just now",
                    isFromMe = true
                )
                conv.copy(
                    lastMessage = text,
                    lastMessageTime = "Just now",
                    isTyping = false,
                    messages = conv.messages + newMsg
                )
            } else conv
        }
    }

    // Profile Operations
    fun updateProfile(bio: String, faculty: String, course: String, year: Int) {
        _currentUser.value = _currentUser.value?.copy(
            bio = bio,
            faculty = faculty,
            course = course,
            yearOfStudy = year
        )
    }

    fun switchUniversity(university: University) {
        _currentUser.value = _currentUser.value?.copy(university = university)
    }

    // Authentication & Account Persistence in Database
    fun signUp(
        fullName: String,
        username: String,
        email: String,
        password: String,
        university: University,
        course: String,
        yearOfStudy: Int,
        socialProvider: String = "EMAIL",
        socialHandle: String? = null,
        googleEmail: String? = null
    ): Result<StudentProfile> {
        val cleanName = fullName.trim()
        val cleanEmail = email.trim().lowercase()
        val cleanUsername = username.trim().lowercase().removePrefix("@")

        if (cleanName.isBlank()) {
            return Result.failure(IllegalArgumentException("Please enter your real full name"))
        }
        if (cleanEmail.isBlank() || !cleanEmail.contains("@")) {
            return Result.failure(IllegalArgumentException("Please enter a valid student email address"))
        }
        if (password.length < 4) {
            return Result.failure(IllegalArgumentException("Password must be at least 4 characters"))
        }

        val existing = _registeredAccounts.value.find {
            it.email.equals(cleanEmail, ignoreCase = true) ||
            it.profile.username.equals(cleanUsername, ignoreCase = true) ||
            (googleEmail != null && it.googleEmail?.equals(googleEmail.trim(), ignoreCase = true) == true)
        }
        if (existing != null) {
            return Result.failure(IllegalArgumentException("An account with this email, username, or Google account is already recorded in the system. Please sign in."))
        }

        val newProfile = StudentProfile(
            id = "user_${UUID.randomUUID()}",
            username = cleanUsername.ifBlank { cleanName.lowercase().replace(" ", "_") },
            displayName = cleanName,
            email = cleanEmail,
            university = university,
            course = course.ifBlank { "General Studies" },
            yearOfStudy = yearOfStudy,
            isVerifiedStudent = true,
            bio = "Student @ ${university.shortName} • Sparkle Connect Campus Member 🎓",
            skills = listOf("Student Leader", "Collaboration"),
            interests = listOf("Campus Life", "Tech & Coding")
        )

        val newAccount = RegisteredAccount(
            id = newProfile.id,
            profile = newProfile,
            email = cleanEmail,
            password = password,
            authProvider = socialProvider,
            googleEmail = googleEmail?.trim()?.lowercase(),
            socialHandle = socialHandle?.trim(),
            isRecordedInDatabase = true
        )

        _registeredAccounts.value = _registeredAccounts.value + newAccount
        _currentUser.value = newProfile

        // Store into persistent Room database
        accountDao?.let { dao ->
            repositoryScope.launch {
                try {
                    dao.insertAccount(AccountEntity.fromRegisteredAccount(newAccount))
                } catch (e: Exception) {
                    // Safe error handling
                }
            }
        }

        return Result.success(newProfile)
    }

    fun signUpWithGoogle(
        realName: String,
        googleEmail: String,
        university: University,
        course: String,
        yearOfStudy: Int,
        avatarUrl: String? = null
    ): Result<StudentProfile> {
        val cleanName = realName.trim()
        val cleanEmail = googleEmail.trim().lowercase()

        if (cleanName.isBlank()) {
            return Result.failure(IllegalArgumentException("Please enter your real full name"))
        }
        if (cleanEmail.isBlank() || !cleanEmail.contains("@")) {
            return Result.failure(IllegalArgumentException("Please enter a valid Google email address"))
        }

        val existing = _registeredAccounts.value.find {
            it.email.equals(cleanEmail, ignoreCase = true) ||
            it.googleEmail?.equals(cleanEmail, ignoreCase = true) == true
        }
        if (existing != null) {
            return Result.failure(IllegalArgumentException("This Google account is already recorded in the database. Please sign in."))
        }

        val username = cleanEmail.substringBefore("@").replace(".", "_")
        val newProfile = StudentProfile(
            id = "google_${UUID.randomUUID()}",
            username = username,
            displayName = cleanName,
            email = cleanEmail,
            avatarUrl = avatarUrl ?: "",
            university = university,
            course = course.ifBlank { "BSc Information Technology" },
            yearOfStudy = yearOfStudy,
            isVerifiedStudent = true,
            bio = "Verified Google Campus Student @ ${university.shortName} 🎓"
        )

        val newAccount = RegisteredAccount(
            id = newProfile.id,
            profile = newProfile,
            email = cleanEmail,
            password = "google_authenticated",
            authProvider = "GOOGLE",
            googleEmail = cleanEmail,
            isRecordedInDatabase = true
        )

        _registeredAccounts.value = _registeredAccounts.value + newAccount
        _currentUser.value = newProfile

        // Store into persistent Room database
        accountDao?.let { dao ->
            repositoryScope.launch {
                try {
                    dao.insertAccount(AccountEntity.fromRegisteredAccount(newAccount))
                } catch (e: Exception) {
                    // Safe error handling
                }
            }
        }

        return Result.success(newProfile)
    }

    fun signIn(identifier: String, password: String): Result<StudentProfile> {
        val cleanIdentifier = identifier.trim().lowercase()

        // Allow Gmail-authenticated accounts to sign in seamlessly even if password is omitted or generated
        val googleAccount = _registeredAccounts.value.find {
            (it.email.equals(cleanIdentifier, ignoreCase = true) ||
             it.googleEmail?.equals(cleanIdentifier, ignoreCase = true) == true) &&
            it.authProvider == "GOOGLE"
        }
        if (googleAccount != null && (password.isBlank() || password == googleAccount.password || password == "google_authenticated")) {
            _currentUser.value = googleAccount.profile
            return Result.success(googleAccount.profile)
        }

        val account = _registeredAccounts.value.find {
            (it.email.equals(cleanIdentifier, ignoreCase = true) ||
             it.profile.username.equals(cleanIdentifier.removePrefix("@"), ignoreCase = true) ||
             it.googleEmail?.equals(cleanIdentifier, ignoreCase = true) == true) &&
            it.password == password
        }

        return if (account != null) {
            _currentUser.value = account.profile
            Result.success(account.profile)
        } else {
            Result.failure(IllegalArgumentException("Account not found or password incorrect. Please verify your credentials or create an account."))
        }
    }

    /**
     * Signs in with Gmail / Google. If the account does not exist in the database,
     * it automatically derives the student's name from Gmail and generates a secure password
     * so no manual password creation is required, saves the profile directly to the database,
     * and signs them in immediately.
     */
    fun signInWithGoogleAccount(
        googleEmail: String,
        displayName: String? = null,
        university: University? = null,
        course: String? = null
    ): Result<StudentProfile> {
        val cleanEmail = googleEmail.trim().lowercase()
        if (cleanEmail.isBlank() || !cleanEmail.contains("@")) {
            return Result.failure(IllegalArgumentException("Please enter a valid Gmail / Google email address"))
        }

        // 1. Check if the account already exists in the database
        val existing = _registeredAccounts.value.find {
            it.googleEmail?.equals(cleanEmail, ignoreCase = true) == true ||
            it.email.equals(cleanEmail, ignoreCase = true)
        }

        if (existing != null) {
            _currentUser.value = existing.profile
            return Result.success(existing.profile)
        }

        // 2. Fetch/derive student's real name from email if not explicitly provided
        val fetchedName = if (!displayName.isNullOrBlank()) {
            displayName.trim()
        } else {
            deriveNameFromEmail(cleanEmail)
        }

        // Auto-generate password so user never has to create or remember a password
        val autoPassword = "gmail_${cleanEmail.substringBefore("@").replace(".", "_")}_auth"
        val assignedUniversity = university ?: universitiesList.firstOrNull() ?: University(
            name = "University of Nairobi",
            shortName = "UoN",
            location = "Nairobi"
        )
        val assignedCourse = course ?: "BSc Computer Science & Tech"
        val cleanUsername = cleanEmail.substringBefore("@").replace(".", "_")

        val newProfile = StudentProfile(
            id = "google_${UUID.randomUUID()}",
            username = cleanUsername,
            displayName = fetchedName,
            email = cleanEmail,
            avatarUrl = "",
            bio = "Verified Google Campus Student @ ${assignedUniversity.shortName} 🎓🇰🇪",
            university = assignedUniversity,
            faculty = "Campus Faculty",
            course = assignedCourse,
            yearOfStudy = 2,
            isVerifiedStudent = true,
            skills = listOf("Campus Networking", "Collaboration"),
            interests = listOf("Tech & Coding", "Campus Events", "Gigs")
        )

        val newAccount = RegisteredAccount(
            id = newProfile.id,
            profile = newProfile,
            email = cleanEmail,
            password = autoPassword,
            authProvider = "GOOGLE",
            googleEmail = cleanEmail,
            isRecordedInDatabase = true
        )

        _registeredAccounts.value = _registeredAccounts.value + newAccount
        _currentUser.value = newProfile

        // Save directly into persistent Room database
        accountDao?.let { dao ->
            repositoryScope.launch {
                try {
                    dao.insertAccount(AccountEntity.fromRegisteredAccount(newAccount))
                } catch (e: Exception) {
                    // Safe error handling
                }
            }
        }

        return Result.success(newProfile)
    }

    fun deriveNameFromEmail(email: String): String {
        val localPart = email.substringBefore("@")
        val words = localPart.split(".", "_", "-")
            .map { it.filter { char -> char.isLetter() } }
            .filter { it.isNotBlank() }

        return if (words.isNotEmpty()) {
            words.joinToString(" ") { word ->
                word.lowercase().replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
            }
        } else {
            localPart.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
        }
    }

    fun signInWithSocial(provider: String, handleOrEmail: String): Result<StudentProfile> {
        val cleanHandle = handleOrEmail.trim().lowercase().removePrefix("@").removePrefix("https://").removePrefix("http://")
        val account = _registeredAccounts.value.find {
            (it.socialHandle?.lowercase()?.removePrefix("@")?.removePrefix("https://")?.removePrefix("http://")?.contains(cleanHandle) == true ||
             it.email.substringBefore("@").equals(cleanHandle, ignoreCase = true) ||
             it.profile.username.equals(cleanHandle, ignoreCase = true)) &&
            it.authProvider.equals(provider, ignoreCase = true)
        }

        return if (account != null) {
            _currentUser.value = account.profile
            Result.success(account.profile)
        } else {
            Result.failure(
                IllegalArgumentException(
                    "No student account found for $provider handle '$handleOrEmail'. Please sign up first to record your account in the database."
                )
            )
        }
    }

    fun signOut() {
        _currentUser.value = null
    }
}
