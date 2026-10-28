package com.example.geotracker.model.response

import com.example.geotracker.model.response.standardResponse.StandardResponse

data class LocationListResponse(
    val standardResponse: StandardResponse,
    val body: List<LocationResponse>
)