package com.example.geotracker.ui.location_capture

import android.content.Context
import android.location.Location
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.local.TokenStorage
import com.example.geotracker.data.repository.LocationRepository
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resumeWithException

data class LocationCaptureState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val message: String? = null
)

class LocationCaptureViewModel(context: Context) : ViewModel() {
    private val repository = LocationRepository(context)
    private val fusedClient: FusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(context)

    private val _state = MutableStateFlow(LocationCaptureState())
    val state: StateFlow<LocationCaptureState> = _state

    fun setError(msg: String) {
        _state.value = _state.value.copy(errorMessage = msg, message = null)
    }

    fun captureAndSave(nombre: String, descripcion: String) {
        _state.value = _state.value.copy(isLoading = true, errorMessage = null, message = null)
        viewModelScope.launch {
            try {
                val result = getCurrentLocation()
                if (result != null) {
                    val request = com.example.geotracker.model.request.LocationRequest(
                        nombre = nombre,
                        descripcion = descripcion,
                        latitud = result.latitude,
                        longitud = result.longitude
                    )
                    val saveResult = repository.registerLocation(request)
                    saveResult.onSuccess { _ ->
                        _state.value = _state.value.copy(isLoading = false, message = "Ubicación guardada correctamente")
                    }.onFailure { error ->
                        _state.value = _state.value.copy(isLoading = false, errorMessage = error.message)
                    }
                } else {
                    _state.value = _state.value.copy(isLoading = false, errorMessage = "No se pudo obtener la ubicación")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(isLoading = false, errorMessage = e.message)
            }
        }
    }

    fun onPermissionResult(granted: Boolean) {
        if (granted) {
            // Permission granted, can capture
        } else {
            _state.value = _state.value.copy(errorMessage = "Se requiere permiso de ubicación")
        }
    }

    private suspend fun getCurrentLocation(): Location? {
        return suspendCancellableCoroutine { continuation ->
            try {
                fusedClient.lastLocation.addOnSuccessListener { location ->
                    continuation.resume(location) {}
                }.addOnFailureListener { exception ->
                    continuation.resumeWithException(exception)
                }
            } catch (e: SecurityException) {
                continuation.resumeWithException(e)
            }
        }
    }
}
