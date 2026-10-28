package com.example.geotracker.ui.navigation

import android.content.Context
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.compose.ui.platform.LocalContext
import com.example.geotracker.ui.login.LoginScreen
import com.example.geotracker.ui.dashboard.DashboardScreen
import com.example.geotracker.ui.map.MapScreen

object Routes {
    const val LOGIN = "login"
    const val DASHBOARD = "dashboard"
    const val REGISTER_LOCATION = "register_location"
    const val MAP_VIEW = "map_view"
}

@Composable
fun AppNavHost(navController: NavHostController, context: Context) {
    NavHost(navController = navController, startDestination = Routes.LOGIN) {
        composable(Routes.LOGIN) {
            LoginScreen(
                modifier = Modifier.fillMaxSize(),
                onLoginSuccess = { userId, nombre, apellido, usuario, token ->
                    com.example.geotracker.data.local.TokenStorage.saveToken(context, token)
                    com.example.geotracker.data.local.TokenStorage.saveUser(context, userId, nombre, apellido, usuario)
                    navController.navigate(Routes.DASHBOARD) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.DASHBOARD) {
            val ctx = LocalContext.current
            DashboardScreen(
                modifier = Modifier.fillMaxSize(),
                context = ctx,
                onRegisterLocationClick = {
                    navController.navigate(Routes.REGISTER_LOCATION)
                },
                onOpenMapClick = {
                    navController.navigate(Routes.MAP_VIEW)
                },
                onOpenLocationsClick = {
                    // List is shown within dashboard for simplicity
                },
                onLogoutClick = {
                    com.example.geotracker.data.local.TokenStorage.clearToken(ctx)
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.REGISTER_LOCATION) {
            com.example.geotracker.ui.location_capture.LocationCaptureScreen(
                modifier = Modifier.fillMaxSize(),
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Routes.MAP_VIEW) {
            MapScreen(modifier = Modifier.fillMaxSize())
        }
    }
}
