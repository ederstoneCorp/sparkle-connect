package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = SparklePurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF2E1B6B),
    onPrimaryContainer = Color(0xFFE2D9FF),
    secondary = SparklePink,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF5A1231),
    onSecondaryContainer = Color(0xFFFFD9E4),
    tertiary = SparkleMint,
    onTertiary = Color(0xFF003825),
    background = SparkleDarkBackground,
    onBackground = SparkleDarkText,
    surface = SparkleDarkSurface,
    onSurface = SparkleDarkText,
    surfaceVariant = Color(0xFF27243C),
    onSurfaceVariant = SparkleDarkSecondaryText,
    outline = SparkleDarkBorder,
)

private val LightColorScheme = lightColorScheme(
    primary = SparklePurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEDE7FF),
    onPrimaryContainer = Color(0xFF2A009C),
    secondary = SparklePink,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFEBF2),
    onSecondaryContainer = Color(0xFF6B0033),
    tertiary = SparkleBlue,
    onTertiary = Color.White,
    background = SparkleLightBackground,
    onBackground = SparklePrimaryText,
    surface = SparkleCardBackground,
    onSurface = SparklePrimaryText,
    surfaceVariant = Color(0xFFF0EFF8),
    onSurfaceVariant = SparkleSecondaryText,
    outline = SparkleBorder,
)

@Composable
fun SparkleConnectTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    // Keep brand identity vibrant and consistent with Sparkle palette across devices
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content,
    )
}
