package cm.vetchi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import cm.vetchi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AuthInterfaceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AuthInterface.class);
        AuthInterface authInterface1 = new AuthInterface();
        authInterface1.setId(1L);
        AuthInterface authInterface2 = new AuthInterface();
        authInterface2.setId(authInterface1.getId());
        assertThat(authInterface1).isEqualTo(authInterface2);
        authInterface2.setId(2L);
        assertThat(authInterface1).isNotEqualTo(authInterface2);
        authInterface1.setId(null);
        assertThat(authInterface1).isNotEqualTo(authInterface2);
    }
}
