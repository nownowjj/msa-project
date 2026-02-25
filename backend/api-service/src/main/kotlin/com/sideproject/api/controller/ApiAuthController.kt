package com.sideproject.api.controller

import com.sideproject.api.client.AuthServiceClient
import com.sideproject.common.security.PermitAll
import lombok.RequiredArgsConstructor
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.sql.DataSource


@RestController
@RequiredArgsConstructor
class ApiAuthController (
    private val authServiceClient: AuthServiceClient,
    private val dataSource: DataSource
){
    private val log = LoggerFactory.getLogger(javaClass)

    @PermitAll
    @GetMapping("/api/permitAll/db-test")
    fun test(): String {
        println("controller hit")
        dataSource.connection.use { conn ->
            conn.createStatement().use { stmt ->
                stmt.executeQuery("select now()").use { rs ->
                    rs.next()
                    return rs.getString(1)
                }
            }
        }
    }


}