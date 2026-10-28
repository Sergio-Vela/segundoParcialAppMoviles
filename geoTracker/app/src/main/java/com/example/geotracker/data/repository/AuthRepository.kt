package com.example.geotracker.data.repository

import android.content.Context
import com.example.geotracker.data.local.TokenStorage
import com.example.geotracker.data.remote.RetrofitClient
import com.example.geotracker.model.request.login.LoginRequest
import com.example.geotracker.model.response.login.LoginResponse

class AuthRepository(private val context: Context) {

    private val apiService = RetrofitClient.getApiService(context)

    suspend fun login(
        usuario: String,
        password: String
    ): Result<LoginResponse> {

        return try {

            val response = apiService.login(
                LoginRequest(usuario, password)
            )

            if (response.isSuccessful && response.body() != null) {

                val loginResponse = response.body()!!

                Result.success(loginResponse)

            } else {
                Result.failure(
                    Exception("Credenciales erróneas")
                )
            }

        } catch (e: Exception) {
            Result.failure(
                Exception("Error de conexión ${e.message}")
            )
        }
    }
}