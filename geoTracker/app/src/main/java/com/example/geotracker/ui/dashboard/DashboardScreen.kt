package com.example.geotracker.ui.dashboard

import android.content.Context
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun DashboardScreen(
    modifier: Modifier = Modifier,
    context: Context = LocalContext.current,
    onRegisterLocationClick: () -> Unit = {},
    onOpenMapClick: () -> Unit = {},
    onOpenLocationsClick: () -> Unit = {},
    onLogoutClick: () -> Unit = {}
) {
    val viewModel: DashboardViewModel = viewModel(
        factory = object : androidx.lifecycle.ViewModelProvider.Factory {
            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                @Suppress("UNCHECKED_CAST")
                return DashboardViewModel(context) as T
            }
        }
    )

    val state by viewModel.state.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadLocations()
    }

    Column(
        modifier = modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Dashboard", style = MaterialTheme.typography.headlineMedium)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = onRegisterLocationClick, modifier = Modifier.weight(1f)) { Text("Registrar ubicación") }
            Button(onClick = onOpenMapClick, modifier = Modifier.weight(1f)) { Text("Ver mapa") }
        }

        Button(onClick = onOpenLocationsClick, modifier = Modifier.fillMaxWidth()) { Text("Ver lista de ubicaciones") }

        if (state.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        } else if (state.errorMessage != null) {
            Text(text = state.errorMessage!!, color = MaterialTheme.colorScheme.error)
        } else if (state.locations.isEmpty()) {
            Text("No hay ubicaciones registradas.")
        } else {
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(state.locations) { loc ->
                    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(text = loc.nombre, style = MaterialTheme.typography.titleMedium)
                            Text(text = loc.descripcion, style = MaterialTheme.typography.bodyMedium)
                            Text(text = "Lat: ${loc.latitud}, Long: ${loc.longitud}", style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
        }

        Button(onClick = onLogoutClick, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)) {
            Text("Cerrar sesión")
        }
    }
}
