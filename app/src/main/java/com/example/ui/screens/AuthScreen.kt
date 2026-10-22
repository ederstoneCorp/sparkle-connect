package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.RegisteredAccount
import com.example.data.model.SocialProvider
import com.example.data.model.StudentProfile
import com.example.data.model.University
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuthScreen(
    universities: List<University>,
    registeredAccounts: List<RegisteredAccount>,
    onSignIn: (String, String) -> Result<StudentProfile>,
    onSignUp: (
        fullName: String,
        username: String,
        email: String,
        password: String,
        university: University,
        course: String,
        yearOfStudy: Int,
        socialProvider: String,
        socialHandle: String?,
        googleEmail: String?
    ) -> Result<StudentProfile>,
    onSignUpWithGoogle: (
        realName: String,
        googleEmail: String,
        university: University,
        course: String,
        yearOfStudy: Int
    ) -> Result<StudentProfile>,
    onGoogleSignIn: (String) -> Result<StudentProfile>,
    onSocialSignIn: (String, String) -> Result<StudentProfile>,
    onLaunchCredentialManagerGoogle: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isSignUpTab by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }

    // Sign In form fields
    var loginIdentifier by remember { mutableStateOf("") }
    var loginPassword by remember { mutableStateOf("") }
    var loginPasswordVisible by remember { mutableStateOf(false) }
    var loginError by remember { mutableStateOf<String?>(null) }

    // Dialog state for Google Sign In / Social Sign In
    var showGoogleSignInDialog by remember { mutableStateOf(false) }
    var googleEmailInput by remember { mutableStateOf("") }
    var googleSignInError by remember { mutableStateOf<String?>(null) }
    var notRegisteredGoogleEmail by remember { mutableStateOf<String?>(null) }

    var showSocialSignInDialog by remember { mutableStateOf(false) }
    var selectedSocialProvider by remember { mutableStateOf(SocialProvider.LINKEDIN) }
    var socialHandleInput by remember { mutableStateOf("") }
    var socialSignInError by remember { mutableStateOf<String?>(null) }

    // Sign Up with Google dialog
    var showGoogleSignUpDialog by remember { mutableStateOf(false) }
    var googleSignUpRealName by remember { mutableStateOf("") }
    var googleSignUpEmail by remember { mutableStateOf("") }
    var googleSignUpUniversity by remember { mutableStateOf(universities.firstOrNull() ?: University(name = "University of Nairobi", shortName = "UoN", location = "Nairobi")) }
    var googleSignUpCourse by remember { mutableStateOf("BSc Computer Science") }
    var googleSignUpYear by remember { mutableStateOf(2) }
    var googleSignUpError by remember { mutableStateOf<String?>(null) }

    // Sign Up regular form fields
    var signUpFullName by remember { mutableStateOf("") }
    var signUpUsername by remember { mutableStateOf("") }
    var signUpEmail by remember { mutableStateOf("") }
    var signUpPassword by remember { mutableStateOf("") }
    var signUpPasswordVisible by remember { mutableStateOf(false) }
    var selectedUniversity by remember { mutableStateOf(universities.firstOrNull() ?: University(name = "University of Nairobi", shortName = "UoN", location = "Nairobi")) }
    var signUpCourse by remember { mutableStateOf("BSc Software Engineering") }
    var signUpYear by remember { mutableStateOf(2) }
    var showUniDropdown by remember { mutableStateOf(false) }
    var linkSocialInSignUp by remember { mutableStateOf(false) }
    var signUpSocialProvider by remember { mutableStateOf(SocialProvider.GOOGLE) }
    var signUpSocialHandle by remember { mutableStateOf("") }
    var signUpError by remember { mutableStateOf<String?>(null) }

    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(top = 40.dp, bottom = 48.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Brand Logo & Header
            item {
                Box(
                    modifier = Modifier
                        .size(70.dp)
                        .clip(RoundedCornerShape(22.dp))
                        .background(SparklePrimaryGradient),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = "Sparkle Connect Logo",
                        tint = Color.White,
                        modifier = Modifier.size(40.dp)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Sparkle",
                        style = MaterialTheme.typography.displayMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                            color = SparklePurple
                        )
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Connect",
                        style = MaterialTheme.typography.displayMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "Kenya University Campus Network & Gigs 🇰🇪",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Medium
                    )
                )

                Spacer(modifier = Modifier.height(24.dp))
            }

            // Tab Selector: Sign In vs Create Account
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(4.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (!isSignUpTab) SparklePurple else Color.Transparent,
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    isSignUpTab = false
                                    loginError = null
                                }
                                .testTag("tab_sign_in")
                        ) {
                            Text(
                                text = "Sign In",
                                style = MaterialTheme.typography.labelLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = if (!isSignUpTab) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                ),
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(vertical = 12.dp)
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSignUpTab) SparklePurple else Color.Transparent,
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    isSignUpTab = true
                                    signUpError = null
                                }
                                .testTag("tab_create_account")
                        ) {
                            Text(
                                text = "Create Account",
                                style = MaterialTheme.typography.labelLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSignUpTab) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                ),
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(vertical = 12.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))
            }

            // Quick Actions: Google & Social Account Authentication
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    // Gmail / Google Sign-In & Registration Option
                    OutlinedButton(
                        onClick = {
                            showGoogleSignInDialog = true
                        },
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        ),
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp)
                            .testTag("google_action_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "Gmail / Google Icon",
                            tint = SparklePurple,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Log in using Gmail",
                                style = MaterialTheme.typography.labelLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )
                            Text(
                                text = "Fetches name automatically & saves to database • No password needed",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Social Media Account button (LinkedIn / GitHub / X)
                    OutlinedButton(
                        onClick = {
                            if (isSignUpTab) {
                                linkSocialInSignUp = true
                            } else {
                                showSocialSignInDialog = true
                            }
                        },
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        ),
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("social_action_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Share,
                            contentDescription = "Social Accounts Icon",
                            tint = SparkleOrange,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = if (isSignUpTab) "Link Social Profile (LinkedIn/GitHub/X)" else "Sign In with Social Media Account",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        HorizontalDivider(modifier = Modifier.weight(1f), color = SparkleBorder)
                        Text(
                            text = if (isSignUpTab) " OR SIGN UP WITH DETAILS " else " OR SIGN IN WITH CREDENTIALS ",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 10.sp
                            ),
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )
                        HorizontalDivider(modifier = Modifier.weight(1f), color = SparkleBorder)
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                }
            }

            // ==================== SIGN IN TAB ====================
            if (!isSignUpTab) {
                item {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            Text(
                                text = "Welcome Back",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Sign in to access your Kenyan campus feed, gigs, and clubs.",
                                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            OutlinedTextField(
                                value = loginIdentifier,
                                onValueChange = {
                                    loginIdentifier = it
                                    loginError = null
                                },
                                label = { Text("Email, Username, or Google Account") },
                                placeholder = { Text("e.g. brian.mutua@uonbi.ac.ke") },
                                leadingIcon = {
                                    Icon(Icons.Default.Person, contentDescription = null, tint = SparklePurple)
                                },
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("login_identifier_input")
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedTextField(
                                value = loginPassword,
                                onValueChange = {
                                    loginPassword = it
                                    loginError = null
                                },
                                label = { Text("Password") },
                                leadingIcon = {
                                    Icon(Icons.Default.Lock, contentDescription = null, tint = SparklePurple)
                                },
                                trailingIcon = {
                                    IconButton(onClick = { loginPasswordVisible = !loginPasswordVisible }) {
                                        Icon(
                                            imageVector = if (loginPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                            contentDescription = "Toggle password visibility"
                                        )
                                    }
                                },
                                visualTransformation = if (loginPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("login_password_input")
                            )

                            loginError?.let { err ->
                                Spacer(modifier = Modifier.height(10.dp))
                                Surface(
                                    color = SparklePink.copy(alpha = 0.1f),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = err,
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = SparklePink,
                                            fontWeight = FontWeight.Medium
                                        ),
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(18.dp))

                            Button(
                                onClick = {
                                    if (loginIdentifier.isBlank()) {
                                        loginError = "Please enter your email, username, or Gmail"
                                        return@Button
                                    }
                                    isSubmitting = true
                                    if (loginIdentifier.trim().lowercase().endsWith("@gmail.com") && loginPassword.isBlank()) {
                                        val result = onGoogleSignIn(loginIdentifier.trim())
                                        isSubmitting = false
                                        if (result.isFailure) {
                                            loginError = result.exceptionOrNull()?.message ?: "Gmail sign-in failed"
                                        }
                                        return@Button
                                    }
                                    if (loginPassword.isBlank()) {
                                        loginError = "Please enter your password (or tap 'Log in using Gmail' above)"
                                        isSubmitting = false
                                        return@Button
                                    }
                                    val result = onSignIn(loginIdentifier, loginPassword)
                                    isSubmitting = false
                                    if (result.isFailure) {
                                        loginError = result.exceptionOrNull()?.message ?: "Sign-in failed"
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                                enabled = !isSubmitting,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(50.dp)
                                    .testTag("submit_login_button")
                            ) {
                                if (isSubmitting) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(20.dp),
                                            color = Color.White,
                                            strokeWidth = 2.dp
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "Signing In...",
                                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                                        )
                                    }
                                } else {
                                    Text(
                                        text = "Sign In to Sparkle Connect",
                                        style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                                    )
                                }
                            }
                        }
                    }
                }
            } else {
                // ==================== CREATE ACCOUNT TAB ====================
                item {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            Text(
                                text = "Create Campus Profile",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Enter your real name and university info. Your record will be stored directly into the database.",
                                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            // REAL FULL NAME
                            OutlinedTextField(
                                value = signUpFullName,
                                onValueChange = {
                                    signUpFullName = it
                                    signUpError = null
                                },
                                label = { Text("Real Full Name *") },
                                placeholder = { Text("e.g. Kelvin Ochieng or Amina Wanjiru") },
                                leadingIcon = {
                                    Icon(Icons.Default.Badge, contentDescription = null, tint = SparklePurple)
                                },
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("signup_fullname_input")
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // USERNAME
                            OutlinedTextField(
                                value = signUpUsername,
                                onValueChange = {
                                    signUpUsername = it
                                    signUpError = null
                                },
                                label = { Text("Campus Handle / Username *") },
                                placeholder = { Text("e.g. kelvin_ochieng") },
                                leadingIcon = {
                                    Icon(Icons.Default.AlternateEmail, contentDescription = null, tint = SparklePurple)
                                },
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("signup_username_input")
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // UNIVERSITY SELECTION DROPDOWN
                            Box {
                                OutlinedTextField(
                                    value = "${selectedUniversity.shortName} - ${selectedUniversity.name}",
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Higher Education Institution *") },
                                    leadingIcon = {
                                        Icon(Icons.Default.School, contentDescription = null, tint = SparklePurple)
                                    },
                                    trailingIcon = {
                                        IconButton(onClick = { showUniDropdown = true }) {
                                            Icon(Icons.Default.ArrowDropDown, contentDescription = "Select University")
                                        }
                                    },
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { showUniDropdown = true }
                                        .testTag("signup_university_selector")
                                )

                                DropdownMenu(
                                    expanded = showUniDropdown,
                                    onDismissRequest = { showUniDropdown = false }
                                ) {
                                    universities.forEach { uni ->
                                        DropdownMenuItem(
                                            text = {
                                                Column {
                                                    Text(
                                                        "${uni.shortName} - ${uni.name}",
                                                        fontWeight = FontWeight.SemiBold
                                                    )
                                                    Text(
                                                        uni.location,
                                                        style = MaterialTheme.typography.bodySmall.copy(
                                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                                        )
                                                    )
                                                }
                                            },
                                            onClick = {
                                                selectedUniversity = uni
                                                showUniDropdown = false
                                            }
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // COURSE OF STUDY
                            OutlinedTextField(
                                value = signUpCourse,
                                onValueChange = { signUpCourse = it },
                                label = { Text("Course of Study *") },
                                placeholder = { Text("e.g. BSc Software Engineering") },
                                leadingIcon = {
                                    Icon(Icons.Default.Book, contentDescription = null, tint = SparklePurple)
                                },
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // YEAR OF STUDY
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    "Year of Study:",
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium)
                                )
                                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    (1..4).forEach { yr ->
                                        FilterChip(
                                            selected = signUpYear == yr,
                                            onClick = { signUpYear = yr },
                                            label = { Text("Yr $yr") }
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // STUDENT EMAIL
                            OutlinedTextField(
                                value = signUpEmail,
                                onValueChange = {
                                    signUpEmail = it
                                    signUpError = null
                                },
                                label = { Text("Student Email Address *") },
                                placeholder = { Text("e.g. student@students.uonbi.ac.ke") },
                                leadingIcon = {
                                    Icon(Icons.Default.Email, contentDescription = null, tint = SparklePurple)
                                },
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("signup_email_input")
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // PASSWORD
                            OutlinedTextField(
                                value = signUpPassword,
                                onValueChange = {
                                    signUpPassword = it
                                    signUpError = null
                                },
                                label = { Text("Create Password *") },
                                leadingIcon = {
                                    Icon(Icons.Default.Lock, contentDescription = null, tint = SparklePurple)
                                },
                                trailingIcon = {
                                    IconButton(onClick = { signUpPasswordVisible = !signUpPasswordVisible }) {
                                        Icon(
                                            imageVector = if (signUpPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                            contentDescription = "Toggle password visibility"
                                        )
                                    }
                                },
                                visualTransformation = if (signUpPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("signup_password_input")
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            // Optional Link Social Account Section
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { linkSocialInSignUp = !linkSocialInSignUp }
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Checkbox(
                                        checked = linkSocialInSignUp,
                                        onCheckedChange = { linkSocialInSignUp = it }
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(
                                            "Link Google or Social Account",
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                        )
                                        Text(
                                            "Allows 1-tap sign-in with your social account later",
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontSize = 11.sp
                                            )
                                        )
                                    }
                                }
                            }

                            if (linkSocialInSignUp) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    SocialProvider.values().forEach { provider ->
                                        FilterChip(
                                            selected = signUpSocialProvider == provider,
                                            onClick = { signUpSocialProvider = provider },
                                            label = { Text(provider.displayName, fontSize = 11.sp) }
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                OutlinedTextField(
                                    value = signUpSocialHandle,
                                    onValueChange = { signUpSocialHandle = it },
                                    label = { Text("${signUpSocialProvider.displayName} handle or email") },
                                    placeholder = { Text("e.g. ${signUpSocialProvider.handlePrefix}username") },
                                    singleLine = true,
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            signUpError?.let { err ->
                                Spacer(modifier = Modifier.height(10.dp))
                                Surface(
                                    color = SparklePink.copy(alpha = 0.1f),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = err,
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = SparklePink,
                                            fontWeight = FontWeight.Medium
                                        ),
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(20.dp))

                            Button(
                                onClick = {
                                    if (signUpFullName.isBlank()) {
                                        signUpError = "Please enter your real full name"
                                        return@Button
                                    }
                                    if (signUpEmail.isBlank() || !signUpEmail.contains("@")) {
                                        signUpError = "Please enter a valid student email address"
                                        return@Button
                                    }
                                    if (signUpPassword.length < 4) {
                                        signUpError = "Password must be at least 4 characters"
                                        return@Button
                                    }

                                    val socialProv = if (linkSocialInSignUp) signUpSocialProvider.name else "EMAIL"
                                    val socialHand = if (linkSocialInSignUp) signUpSocialHandle.ifBlank { null } else null
                                    val gEmail = if (linkSocialInSignUp && signUpSocialProvider == SocialProvider.GOOGLE) {
                                        signUpSocialHandle.ifBlank { signUpEmail }
                                    } else null

                                    val result = onSignUp(
                                        signUpFullName,
                                        signUpUsername,
                                        signUpEmail,
                                        signUpPassword,
                                        selectedUniversity,
                                        signUpCourse,
                                        signUpYear,
                                        socialProv,
                                        socialHand,
                                        gEmail
                                    )
                                    if (result.isFailure) {
                                        signUpError = result.exceptionOrNull()?.message ?: "Account registration failed"
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp)
                                    .testTag("submit_signup_button")
                            ) {
                                Icon(Icons.Default.CloudUpload, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Store Account in Database & Enter",
                                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // ==================== DIALOG: GOOGLE / GMAIL SIGN-IN ====================
    if (showGoogleSignInDialog) {
        AlertDialog(
            onDismissRequest = {
                showGoogleSignInDialog = false
                googleSignInError = null
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AccountCircle, contentDescription = null, tint = SparklePurple)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Log in using Gmail", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column {
                    Text(
                        "Enter your Gmail address. Sparkle Connect automatically fetches your name and configures access — you don't need to create a password to use the app! Your profile is saved directly to the database.",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    Text("Enter Gmail address:", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
                    Spacer(modifier = Modifier.height(6.dp))

                    OutlinedTextField(
                        value = googleEmailInput,
                        onValueChange = {
                            googleEmailInput = it
                            googleSignInError = null
                        },
                        label = { Text("Gmail Address") },
                        placeholder = { Text("e.g. holdstonez@gmail.com") },
                        leadingIcon = {
                            Icon(Icons.Default.Email, contentDescription = null, tint = SparklePurple)
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("google_email_signin_input")
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // One-tap Device Google Account
                    OutlinedButton(
                        onClick = {
                            onLaunchCredentialManagerGoogle()
                            showGoogleSignInDialog = false
                        },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Fingerprint, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Use Device Google Account (One-Tap)", fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    googleSignInError?.let { err ->
                        Spacer(modifier = Modifier.height(10.dp))
                        Surface(
                            color = SparklePink.copy(alpha = 0.12f),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = err,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = SparklePink,
                                    fontWeight = FontWeight.Medium
                                ),
                                modifier = Modifier.padding(8.dp)
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val input = googleEmailInput.trim()
                        if (input.isBlank() || !input.contains("@")) {
                            googleSignInError = "Please enter a valid Gmail address (e.g. name@gmail.com)"
                            return@Button
                        }
                        val res = onGoogleSignIn(input)
                        if (res.isSuccess) {
                            showGoogleSignInDialog = false
                        } else {
                            googleSignInError = res.exceptionOrNull()?.message ?: "Failed to log in with Gmail"
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple)
                ) {
                    Text("Log in with Gmail (No Password Needed)")
                }
            },
            dismissButton = {
                TextButton(onClick = { showGoogleSignInDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // ==================== DIALOG: SOCIAL MEDIA SIGN-IN ====================
    if (showSocialSignInDialog) {
        AlertDialog(
            onDismissRequest = {
                showSocialSignInDialog = false
                socialSignInError = null
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Share, contentDescription = null, tint = SparkleOrange)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Sign in with Social Account", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column {
                    Text(
                        "Checks if your social media account is recorded in the Sparkle Connect database.",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf(SocialProvider.LINKEDIN, SocialProvider.GITHUB, SocialProvider.TWITTER).forEach { prov ->
                            FilterChip(
                                selected = selectedSocialProvider == prov,
                                onClick = { selectedSocialProvider = prov },
                                label = { Text(prov.displayName) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = socialHandleInput,
                        onValueChange = {
                            socialHandleInput = it
                            socialSignInError = null
                        },
                        label = { Text("${selectedSocialProvider.displayName} Handle or Profile URL") },
                        placeholder = { Text("e.g. ${selectedSocialProvider.handlePrefix}name") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    socialSignInError?.let { err ->
                        Spacer(modifier = Modifier.height(10.dp))
                        Surface(
                            color = SparklePink.copy(alpha = 0.12f),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = err,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = SparklePink,
                                    fontWeight = FontWeight.Medium
                                ),
                                modifier = Modifier.padding(8.dp)
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val res = onSocialSignIn(selectedSocialProvider.name, socialHandleInput)
                        if (res.isSuccess) {
                            showSocialSignInDialog = false
                        } else {
                            socialSignInError = res.exceptionOrNull()?.message
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple)
                ) {
                    Text("Sign In")
                }
            },
            dismissButton = {
                TextButton(onClick = { showSocialSignInDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // ==================== DIALOG: SIGN UP WITH GOOGLE ====================
    if (showGoogleSignUpDialog) {
        var showGoogleUniDropdown by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { showGoogleSignUpDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CloudDone, contentDescription = null, tint = SparklePurple)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Record Google Student Profile", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column {
                    Text(
                        "Your real name and Google account will be recorded into the Sparkle Connect database.",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = googleSignUpRealName,
                        onValueChange = { googleSignUpRealName = it },
                        label = { Text("Real Full Name *") },
                        placeholder = { Text("e.g. Kelvin Ochieng") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = googleSignUpEmail,
                        onValueChange = { googleSignUpEmail = it },
                        label = { Text("Google Email *") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Institution Dropdown
                    Box {
                        OutlinedTextField(
                            value = "${googleSignUpUniversity.shortName} - ${googleSignUpUniversity.name}",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("University *") },
                            trailingIcon = {
                                IconButton(onClick = { showGoogleUniDropdown = true }) {
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                                }
                            },
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showGoogleUniDropdown = true }
                        )

                        DropdownMenu(
                            expanded = showGoogleUniDropdown,
                            onDismissRequest = { showGoogleUniDropdown = false }
                        ) {
                            universities.forEach { uni ->
                                DropdownMenuItem(
                                    text = { Text("${uni.shortName} - ${uni.name}") },
                                    onClick = {
                                        googleSignUpUniversity = uni
                                        showGoogleUniDropdown = false
                                    }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = googleSignUpCourse,
                        onValueChange = { googleSignUpCourse = it },
                        label = { Text("Course of Study") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    googleSignUpError?.let { err ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = err,
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = SparklePink,
                                fontWeight = FontWeight.Medium
                            )
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val res = onSignUpWithGoogle(
                            googleSignUpRealName,
                            googleSignUpEmail,
                            googleSignUpUniversity,
                            googleSignUpCourse,
                            googleSignUpYear
                        )
                        if (res.isSuccess) {
                            showGoogleSignUpDialog = false
                        } else {
                            googleSignUpError = res.exceptionOrNull()?.message
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple)
                ) {
                    Text("Save to Database & Sign In")
                }
            },
            dismissButton = {
                TextButton(onClick = { showGoogleSignUpDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
