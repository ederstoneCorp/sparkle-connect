package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.RegisteredAccount
import com.example.data.model.SocialProvider
import com.example.data.model.StudentProfile
import com.example.data.model.University
import com.example.ui.components.SearchableUniversityDialog
import com.example.ui.theme.*

/**
 * Facebook-style Authentication Screen for Sparkle Connect.
 *
 * Implements Facebook's authentic mobile login UX:
 * 1. Screen lobes / notch / cutout aware with statusBarsPadding() & navigationBarsPadding().
 * 2. Top language / locale indicator.
 * 3. Recent Logins row with 1-tap saved account cards.
 * 4. Primary login card with username/email & password, prominent "Log In" button, and "Forgotten password?".
 * 5. Instant 1-tap Google/Gmail and Social account options.
 * 6. Signature Facebook bottom "Create new account" button with complete student registration flow.
 */
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

    var showSocialSignInDialog by remember { mutableStateOf(false) }
    var selectedSocialProvider by remember { mutableStateOf(SocialProvider.LINKEDIN) }
    var socialHandleInput by remember { mutableStateOf("") }
    var socialSignInError by remember { mutableStateOf<String?>(null) }

    // Forgotten password dialog
    var showForgotPasswordDialog by remember { mutableStateOf(false) }
    var forgotAccountQuery by remember { mutableStateOf("") }
    var forgotPasswordResult by remember { mutableStateOf<String?>(null) }

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
    var showUniSearchDialog by remember { mutableStateOf(false) }
    var showConfirmDetailsDialog by remember { mutableStateOf(false) }
    var linkSocialInSignUp by remember { mutableStateOf(false) }
    var signUpSocialProvider by remember { mutableStateOf(SocialProvider.GOOGLE) }
    var signUpSocialHandle by remember { mutableStateOf("") }
    var signUpError by remember { mutableStateOf<String?>(null) }

    Surface(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding(),
        color = MaterialTheme.colorScheme.background
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Facebook-style Top Language Strip
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "English (UK) • Kiswahili • Sheng",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                            fontSize = 11.sp
                        )
                    )
                }
            }

            // Brand Header: Sparkle Connect (Styled in Facebook layout with Sparkle Brand Colors)
            item {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(SparklePrimaryGradient),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = "Sparkle Connect Logo",
                        tint = Color.White,
                        modifier = Modifier.size(36.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Sparkle",
                        style = MaterialTheme.typography.headlineLarge.copy(
                            fontWeight = FontWeight.ExtraBold,
                            color = SparklePurple
                        )
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Connect",
                        style = MaterialTheme.typography.headlineLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    )
                }

                Text(
                    text = "Kenya University Campus Network & Gigs 🇰🇪",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Medium
                    ),
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(20.dp))
            }

            // Facebook Signature Feature: Recent Logins (1-Tap Saved Account Cards)
            if (!isSignUpTab && registeredAccounts.isNotEmpty()) {
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Recent logins",
                                style = MaterialTheme.typography.titleSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                            )
                            Text(
                                text = "Edit",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = SparklePurple,
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }

                        Text(
                            text = "Click your account or add an account to log in instantly.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontSize = 11.sp
                            )
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            items(registeredAccounts, key = { it.id }) { acc ->
                                Card(
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                                    modifier = Modifier
                                        .width(135.dp)
                                        .clickable {
                                            isSubmitting = true
                                            if (acc.authProvider == "GOOGLE" && acc.googleEmail != null) {
                                                val res = onGoogleSignIn(acc.googleEmail)
                                                isSubmitting = false
                                                if (res.isFailure) {
                                                    loginError = res.exceptionOrNull()?.message
                                                }
                                            } else {
                                                val res = onSignIn(acc.email, acc.password)
                                                isSubmitting = false
                                                if (res.isFailure) {
                                                    loginError = res.exceptionOrNull()?.message
                                                }
                                            }
                                        }
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        modifier = Modifier.padding(12.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(54.dp)
                                                .clip(CircleShape)
                                                .background(SparklePrimaryGradient),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = acc.profile.displayName.split(" ")
                                                    .mapNotNull { it.firstOrNull() }
                                                    .take(2)
                                                    .joinToString(""),
                                                style = MaterialTheme.typography.titleMedium.copy(
                                                    color = Color.White,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            )
                                        }

                                        Spacer(modifier = Modifier.height(8.dp))

                                        Text(
                                            text = acc.profile.displayName,
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            textAlign = TextAlign.Center
                                        )

                                        Text(
                                            text = acc.profile.university.shortName,
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                color = SparklePurple,
                                                fontWeight = FontWeight.SemiBold,
                                                fontSize = 10.sp
                                            ),
                                            textAlign = TextAlign.Center
                                        )

                                        Spacer(modifier = Modifier.height(8.dp))

                                        Surface(
                                            shape = RoundedCornerShape(12.dp),
                                            color = SparklePurple.copy(alpha = 0.12f),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Text(
                                                text = "Log In",
                                                style = MaterialTheme.typography.labelSmall.copy(
                                                    color = SparklePurple,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 11.sp
                                                ),
                                                textAlign = TextAlign.Center,
                                                modifier = Modifier.padding(vertical = 4.dp)
                                            )
                                        }
                                    }
                                }
                            }

                            // Add Account Option Tile
                            item {
                                Card(
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                                    border = BorderStroke(1.dp, SparkleBorder),
                                    modifier = Modifier
                                        .width(110.dp)
                                        .clickable {
                                            loginIdentifier = ""
                                            loginPassword = ""
                                            loginError = null
                                        }
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.Center,
                                        modifier = Modifier
                                            .fillMaxHeight()
                                            .padding(12.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(46.dp)
                                                .clip(CircleShape)
                                                .background(SparklePurple.copy(alpha = 0.15f)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                Icons.Default.Add,
                                                contentDescription = "Add Account",
                                                tint = SparklePurple,
                                                modifier = Modifier.size(24.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Text(
                                            text = "Add account",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.onSurface
                                            ),
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // ==================== PRIMARY LOGIN FORM (Facebook Style Card) ====================
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
                                text = "Log In",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )
                            Text(
                                text = "Enter your student email, username, or phone number",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            // Username / Student Email input
                            OutlinedTextField(
                                value = loginIdentifier,
                                onValueChange = {
                                    loginIdentifier = it
                                    loginError = null
                                },
                                label = { Text("Mobile number, email, or username") },
                                placeholder = { Text("e.g. brian.mutua@uonbi.ac.ke") },
                                leadingIcon = {
                                    Icon(Icons.Default.Person, contentDescription = null, tint = SparklePurple)
                                },
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = SparklePurple,
                                    unfocusedBorderColor = SparkleBorder
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("login_identifier_input")
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            // Password input
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
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = SparklePurple,
                                    unfocusedBorderColor = SparkleBorder
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("login_password_input")
                            )

                            loginError?.let { err ->
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
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(18.dp))

                            // Facebook-style Big Primary Log In button
                            Button(
                                onClick = {
                                    if (loginIdentifier.isBlank()) {
                                        loginError = "Please enter your mobile number, email, or username"
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
                                        loginError = "Please enter your password or choose 'Log in using Gmail'"
                                        isSubmitting = false
                                        return@Button
                                    }
                                    val result = onSignIn(loginIdentifier, loginPassword)
                                    isSubmitting = false
                                    if (result.isFailure) {
                                        loginError = result.exceptionOrNull()?.message ?: "Invalid credentials. Please try again."
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
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(20.dp),
                                        color = Color.White,
                                        strokeWidth = 2.dp
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Logging In...",
                                        style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                                    )
                                } else {
                                    Text(
                                        text = "Log In",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Facebook-style Forgotten Password Link
                            TextButton(
                                onClick = {
                                    forgotAccountQuery = loginIdentifier
                                    forgotPasswordResult = null
                                    showForgotPasswordDialog = true
                                },
                                modifier = Modifier.align(Alignment.CenterHorizontally)
                            ) {
                                Text(
                                    text = "Forgotten password?",
                                    style = MaterialTheme.typography.labelLarge.copy(
                                        color = SparklePurple,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Divider with "or"
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                HorizontalDivider(modifier = Modifier.weight(1f), color = SparkleBorder)
                                Text(
                                    text = "or",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    ),
                                    modifier = Modifier.padding(horizontal = 10.dp)
                                )
                                HorizontalDivider(modifier = Modifier.weight(1f), color = SparkleBorder)
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            // 1-Tap Gmail Authentication
                            OutlinedButton(
                                onClick = { showGoogleSignInDialog = true },
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .testTag("google_action_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AccountCircle,
                                    contentDescription = null,
                                    tint = SparklePurple,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Log in using Gmail (No password needed)",
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Social Media Authentication
                            OutlinedButton(
                                onClick = { showSocialSignInDialog = true },
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(46.dp)
                                    .testTag("social_action_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Share,
                                    contentDescription = null,
                                    tint = SparkleOrange,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Log in with LinkedIn / GitHub / X",
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(28.dp))

                    // Facebook Signature Bottom Action: "Create new account" button
                    OutlinedButton(
                        onClick = {
                            isSignUpTab = true
                            signUpError = null
                        },
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        ),
                        border = BorderStroke(1.5.dp, SparklePurple),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("tab_create_account")
                    ) {
                        Text(
                            text = "Create new account",
                            style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = SparklePurple
                            )
                        )
                    }
                }
            } else {
                // ==================== CREATE NEW ACCOUNT FLOW (Facebook Style) ====================
                item {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Join Sparkle Connect",
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                )
                                TextButton(
                                    onClick = { isSignUpTab = false },
                                    modifier = Modifier.testTag("tab_sign_in")
                                ) {
                                    Text(
                                        text = "Already have an account?",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = SparklePurple,
                                            fontWeight = FontWeight.Bold
                                        )
                                    )
                                }
                            }

                            Text(
                                text = "Create a profile to connect with Kenyan campus peers, gigs, and clubs.",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            // REAL FULL NAME
                            OutlinedTextField(
                                value = signUpFullName,
                                onValueChange = {
                                    signUpFullName = it
                                    signUpError = null
                                },
                                label = { Text("What's your name? (Real Full Name) *") },
                                placeholder = { Text("e.g. Brian Mutua or Amina Wanjiru") },
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

                            // USERNAME / CAMPUS HANDLE
                            OutlinedTextField(
                                value = signUpUsername,
                                onValueChange = {
                                    signUpUsername = it
                                    signUpError = null
                                },
                                label = { Text("Campus Handle / Username *") },
                                placeholder = { Text("e.g. brian_mutua") },
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

                            // HIGHER EDUCATION INSTITUTION SELECTOR (Searchable with Google Grounding)
                            Box {
                                OutlinedTextField(
                                    value = "${selectedUniversity.shortName} - ${selectedUniversity.name}",
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Higher Education Institution (Search any Kenyan Campus) *") },
                                    leadingIcon = {
                                        Icon(Icons.Default.School, contentDescription = null, tint = SparklePurple)
                                    },
                                    trailingIcon = {
                                        IconButton(onClick = { showUniSearchDialog = true }) {
                                            Icon(Icons.Default.Search, contentDescription = "Search University", tint = SparklePurple)
                                        }
                                    },
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { showUniSearchDialog = true }
                                        .testTag("signup_university_selector")
                                )
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
                                placeholder = { Text("e.g. brian@students.uonbi.ac.ke") },
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
                                            "Link Google or Social Profile",
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                        )
                                        Text(
                                            "Enables 1-tap fast sign-in later",
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
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(20.dp))

                            // Submit Registration with Confirmation Review Step
                            Button(
                                onClick = {
                                    if (signUpFullName.isBlank()) {
                                        signUpError = "Please enter your real full name"
                                        return@Button
                                    }
                                    if (signUpUsername.isBlank()) {
                                        signUpError = "Please enter your campus handle / username"
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

                                    // Open Confirmation Dialog to verify details before writing to database
                                    showConfirmDetailsDialog = true
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
                                    text = "Join Campus Network & Save to Database",
                                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                                )
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            // Back to Login Link
                            TextButton(
                                onClick = { isSignUpTab = false },
                                modifier = Modifier.align(Alignment.CenterHorizontally)
                            ) {
                                Text(
                                    text = "Already have an account? Log In",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = SparklePurple,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // Meta/Facebook Style Footer
            item {
                Spacer(modifier = Modifier.height(30.dp))
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Sparkle Connect by CampusLabs 🇰🇪",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Text(
                        text = "Meta-inspired campus network • About • Help • Terms & Privacy",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                            fontSize = 11.sp
                        ),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }

    // ==================== DIALOG: FORGOTTEN PASSWORD / ACCOUNT RECOVERY ====================
    if (showForgotPasswordDialog) {
        AlertDialog(
            onDismissRequest = { showForgotPasswordDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Search, contentDescription = null, tint = SparklePurple)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Find Your Account", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column {
                    Text(
                        "Please enter your student email or username to search for your account in the Sparkle Connect database.",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = forgotAccountQuery,
                        onValueChange = {
                            forgotAccountQuery = it
                            forgotPasswordResult = null
                        },
                        label = { Text("Email or Username") },
                        placeholder = { Text("e.g. brian.mutua@uonbi.ac.ke") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    forgotPasswordResult?.let { res ->
                        Spacer(modifier = Modifier.height(10.dp))
                        Surface(
                            color = SparklePurple.copy(alpha = 0.12f),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = res,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = SparklePurple,
                                    fontWeight = FontWeight.Medium
                                ),
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val q = forgotAccountQuery.trim().lowercase()
                        val matched = registeredAccounts.find {
                            it.email.lowercase() == q ||
                            it.profile.username.lowercase() == q ||
                            (it.googleEmail != null && it.googleEmail.lowercase() == q)
                        }
                        if (matched != null) {
                            forgotPasswordResult = "Found account for ${matched.profile.displayName} (${matched.profile.university.shortName})! You can log in using email: ${matched.email}."
                            loginIdentifier = matched.email
                        } else {
                            forgotPasswordResult = "No account found matching '$forgotAccountQuery'. Please create a new account or try another email."
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple)
                ) {
                    Text("Search Database")
                }
            },
            dismissButton = {
                TextButton(onClick = { showForgotPasswordDialog = false }) {
                    Text("Close")
                }
            }
        )
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
                        placeholder = { Text("e.g. student@gmail.com") },
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
                    Text("Log in with Gmail")
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

    // ==================== DIALOG: CONFIRM ACCOUNT DETAILS ====================
    if (showConfirmDetailsDialog) {
        AlertDialog(
            onDismissRequest = { showConfirmDetailsDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = SparklePurple)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Confirm Your Details", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column {
                    Text(
                        "Please verify that your campus details are correct before saving your profile to the database:",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("• Real Name: $signUpFullName", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                            Text("• Handle: @$signUpUsername", fontSize = 13.sp)
                            Text(
                                "• Institution: ${selectedUniversity.shortName} - ${selectedUniversity.name}",
                                fontWeight = FontWeight.Bold,
                                color = SparklePurple,
                                fontSize = 13.sp
                            )
                            Text("• Course: $signUpCourse (Year $signUpYear)", fontSize = 13.sp)
                            Text("• Student Email: $signUpEmail", fontSize = 13.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = SparkleOrange.copy(alpha = 0.12f),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.WarningAmber, contentDescription = null, tint = SparkleOrange, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                "Important: Your selected university cannot be changed after registration.",
                                style = MaterialTheme.typography.labelSmall.copy(color = SparkleOrange, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmDetailsDialog = false
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
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple)
                ) {
                    Text("Confirm & Create Account")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfirmDetailsDialog = false }) {
                    Text("Edit Details")
                }
            }
        )
    }

    // ==================== DIALOG: SEARCHABLE UNIVERSITY SELECTOR ====================
    if (showUniSearchDialog) {
        SearchableUniversityDialog(
            universities = universities,
            selectedUniversity = selectedUniversity,
            onSelectUniversity = { uni ->
                selectedUniversity = uni
                showUniSearchDialog = false
            },
            onDismiss = { showUniSearchDialog = false }
        )
    }
}
