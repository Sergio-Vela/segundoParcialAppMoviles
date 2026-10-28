package com.example.geotracker.model.response.login

data class LoginBody(
    val token: String,
    val user: UserResponse
)