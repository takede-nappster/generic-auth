package cm.vetchi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import cm.vetchi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdditionalDataTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdditionalData.class);
        AdditionalData additionalData1 = new AdditionalData();
        additionalData1.setId(1L);
        AdditionalData additionalData2 = new AdditionalData();
        additionalData2.setId(additionalData1.getId());
        assertThat(additionalData1).isEqualTo(additionalData2);
        additionalData2.setId(2L);
        assertThat(additionalData1).isNotEqualTo(additionalData2);
        additionalData1.setId(null);
        assertThat(additionalData1).isNotEqualTo(additionalData2);
    }
}
