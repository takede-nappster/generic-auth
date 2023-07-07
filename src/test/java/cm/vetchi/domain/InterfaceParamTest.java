package cm.vetchi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import cm.vetchi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InterfaceParamTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InterfaceParam.class);
        InterfaceParam interfaceParam1 = new InterfaceParam();
        interfaceParam1.setId(1L);
        InterfaceParam interfaceParam2 = new InterfaceParam();
        interfaceParam2.setId(interfaceParam1.getId());
        assertThat(interfaceParam1).isEqualTo(interfaceParam2);
        interfaceParam2.setId(2L);
        assertThat(interfaceParam1).isNotEqualTo(interfaceParam2);
        interfaceParam1.setId(null);
        assertThat(interfaceParam1).isNotEqualTo(interfaceParam2);
    }
}
