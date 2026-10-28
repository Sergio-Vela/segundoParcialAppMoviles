package com.example.geotracker.model.response.login

import com.example.geotracker.model.response.standardResponse.StandardResponse

data class LoginResponse(
    val standardResponse: StandardResponse,
    val body: LoginBody
)
