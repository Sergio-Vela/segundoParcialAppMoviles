package com.example.geotracker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController
import com.example.geotracker.ui.navigation.AppNavHost
import com.example.geotracker.ui.theme.GeoTrackerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GeoTrackerTheme {
                GeoTrackerApp(context = this)
            }
        }
    }
}

@Composable
fun GeoTrackerApp(context: android.content.Context) {
    val navController = rememberNavController()
    AppNavHost(navController = navController, context = context)
}
