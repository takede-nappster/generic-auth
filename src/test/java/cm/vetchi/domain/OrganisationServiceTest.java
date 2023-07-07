package cm.vetchi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import cm.vetchi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrganisationServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganisationService.class);
        OrganisationService organisationService1 = new OrganisationService();
        organisationService1.setId(1L);
        OrganisationService organisationService2 = new OrganisationService();
        organisationService2.setId(organisationService1.getId());
        assertThat(organisationService1).isEqualTo(organisationService2);
        organisationService2.setId(2L);
        assertThat(organisationService1).isNotEqualTo(organisationService2);
        organisationService1.setId(null);
        assertThat(organisationService1).isNotEqualTo(organisationService2);
    }
}
