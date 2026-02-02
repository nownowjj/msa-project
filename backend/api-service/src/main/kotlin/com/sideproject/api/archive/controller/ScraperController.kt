package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.UrlMetadata
import com.sideproject.api.archive.service.ScraperService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/scraper")
class ScraperController (
    private val scraperService: ScraperService
){
    // Url metadata scrapping
    @GetMapping
    fun getUrlMetaData(@RequestParam url: String):UrlMetadata{
        return  scraperService.extract(url)
    }
}1