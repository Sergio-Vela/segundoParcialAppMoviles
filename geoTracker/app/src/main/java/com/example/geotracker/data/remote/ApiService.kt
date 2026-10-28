package com.example.geotracker.data.remote

import com.example.geotracker.model.request.LocationRequest
import com.example.geotracker.model.request.login.LoginRequest
import com.example.geotracker.model.response.LocationListResponse
import com.example.geotracker.model.response.LocationResponse
import com.example.geotracker.model.response.login.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("api/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<LoginResponse>

    @POST("api/locations")
    suspend fun registerLocation(
        @Body request: LocationRequest
    ): Response<LocationResponse>

    @GET("api/locations")
    suspend fun getLocations(): Response<LocationListResponse>

}