package am.developer.keyklock.service;


import am.developer.keyklock.dto.UserData;
import am.developer.keyklock.properties.KeycloakProperties;
import am.developer.keyklock.properties.RoleProperties;
import am.developer.keyklock.util.RoleUtil;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * The service class for ProfileData.
 *
 * @author a509159
 * @version 1.0.0
 * @since 1.0.0
 */
@Service
@Slf4j
public class ProfileDataService {

	private final KeycloakProperties keycloakProperties;

	private final RoleProperties roleProperties;

	@Value("${defaultProfileRole}")
	public String profileAtm;


	@Autowired
	public ProfileDataService(KeycloakProperties keycloakProperties, RoleProperties roleProperties) {
		this.keycloakProperties = keycloakProperties;
		this.roleProperties = roleProperties;
	}

	@CacheEvict(value = "profileData", allEntries = true)
	@Scheduled(fixedRateString = "${caching.spring.profileData.ttl}")
	public void emptyProfileDataCache() {
		log.debug("Emptying profileData cache for all entries after ttl.");
	}

	public UserData getKeycloakUserPrinciple() {
		UserData userdata = new UserData();
		Optional<AccessToken> accessTokenOpt = this.getAccessToken();

		if (accessTokenOpt.isPresent()) {
			AccessToken accessToken = accessTokenOpt.get();
			Optional<String> activeRole = RoleUtil.findActiveRole(accessToken, keycloakProperties.getClientId(), roleProperties.getNoDisplayRoles(), roleProperties.getAdminRole());

			activeRole.ifPresent(userdata::setUserRole);
			userdata.setUsername(accessToken.getPreferredUsername());
		}

		return userdata;
	}

	public static Optional<AccessToken> getAccessToken() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && (authentication.getPrincipal() instanceof KeycloakPrincipal)) {
			KeycloakPrincipal<?> keycloakPrincipal = ((KeycloakPrincipal<?>) authentication.getPrincipal());
			AccessToken accessToken = keycloakPrincipal.getKeycloakSecurityContext().getToken();
			return Optional.ofNullable(accessToken);
		}
		return Optional.empty();
	}
}
