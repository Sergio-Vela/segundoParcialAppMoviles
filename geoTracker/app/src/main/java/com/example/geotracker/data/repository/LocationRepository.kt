package com.example.geotracker.data.repository

import android.content.Context
import com.example.geotracker.data.remote.RetrofitClient
import com.example.geotracker.model.request.LocationRequest
import com.example.geotracker.model.response.LocationListResponse
import com.example.geotracker.model.response.LocationResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class LocationRepository(private val context: Context) {

    private val apiService = RetrofitClient.getApiService(context)

    suspend fun registerLocation(
        request: LocationRequest
    ): Result<LocationResponse> {
        return try {
            val response = apiService.registerLocation(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(
                    Exception(response.errorBody()?.string() ?: "Error al registrar ubicación")
                )
            }
        } catch (e: Exception) {
            Result.failure(Exception("Error de conexión: ${e.message}"))
        }
    }

    suspend fun getLocations(): Result<List<LocationResponse>> {
        return try {
            val response = apiService.getLocations()
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                if (body.body.isEmpty()) {
                    Result.success(emptyList())
                } else {
                    Result.success(body.body)
                }
            } else {
                Result.failure(
                    Exception(response.errorBody()?.string() ?: "Error al obtener ubicaciones")
                )
            }
        } catch (e: Exception) {
            Result.failure(Exception("Error de conexión: ${e.message}"))
        }
    }
}
