package com.example.geotracker.model.response

import com.example.geotracker.model.response.standardResponse.StandardResponse

data class SingleLocationResponse(
    val standardResponse: StandardResponse,
    val body: LocationResponse
)