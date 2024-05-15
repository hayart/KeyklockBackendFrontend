package am.developer.keyklock.properties;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration class for role related properties
 */
@Getter
@Configuration
public class RoleProperties {

    /**
     * No Display roles property
     */
    @Value("#{'${no.display.roles}'.split(';')}")
    private List<String> noDisplayRoles;

    /**
     * Admin role property
     */
    @Value("${admin.role}")
    private String adminRole;

}
