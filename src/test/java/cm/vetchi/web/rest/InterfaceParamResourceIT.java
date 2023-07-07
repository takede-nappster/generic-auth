package cm.vetchi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cm.vetchi.IntegrationTest;
import cm.vetchi.domain.InterfaceParam;
import cm.vetchi.repository.InterfaceParamRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link InterfaceParamResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InterfaceParamResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/interface-params";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InterfaceParamRepository interfaceParamRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInterfaceParamMockMvc;

    private InterfaceParam interfaceParam;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InterfaceParam createEntity(EntityManager em) {
        InterfaceParam interfaceParam = new InterfaceParam().name(DEFAULT_NAME).value(DEFAULT_VALUE);
        return interfaceParam;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InterfaceParam createUpdatedEntity(EntityManager em) {
        InterfaceParam interfaceParam = new InterfaceParam().name(UPDATED_NAME).value(UPDATED_VALUE);
        return interfaceParam;
    }

    @BeforeEach
    public void initTest() {
        interfaceParam = createEntity(em);
    }

    @Test
    @Transactional
    void createInterfaceParam() throws Exception {
        int databaseSizeBeforeCreate = interfaceParamRepository.findAll().size();
        // Create the InterfaceParam
        restInterfaceParamMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isCreated());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeCreate + 1);
        InterfaceParam testInterfaceParam = interfaceParamList.get(interfaceParamList.size() - 1);
        assertThat(testInterfaceParam.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testInterfaceParam.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createInterfaceParamWithExistingId() throws Exception {
        // Create the InterfaceParam with an existing ID
        interfaceParam.setId(1L);

        int databaseSizeBeforeCreate = interfaceParamRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInterfaceParamMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInterfaceParams() throws Exception {
        // Initialize the database
        interfaceParamRepository.saveAndFlush(interfaceParam);

        // Get all the interfaceParamList
        restInterfaceParamMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(interfaceParam.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getInterfaceParam() throws Exception {
        // Initialize the database
        interfaceParamRepository.saveAndFlush(interfaceParam);

        // Get the interfaceParam
        restInterfaceParamMockMvc
            .perform(get(ENTITY_API_URL_ID, interfaceParam.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(interfaceParam.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingInterfaceParam() throws Exception {
        // Get the interfaceParam
        restInterfaceParamMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInterfaceParam() throws Exception {
        // Initialize the database
        interfaceParamRepository.saveAndFlush(interfaceParam);

        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();

        // Update the interfaceParam
        InterfaceParam updatedInterfaceParam = interfaceParamRepository.findById(interfaceParam.getId()).get();
        // Disconnect from session so that the updates on updatedInterfaceParam are not directly saved in db
        em.detach(updatedInterfaceParam);
        updatedInterfaceParam.name(UPDATED_NAME).value(UPDATED_VALUE);

        restInterfaceParamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInterfaceParam.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInterfaceParam))
            )
            .andExpect(status().isOk());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
        InterfaceParam testInterfaceParam = interfaceParamList.get(interfaceParamList.size() - 1);
        assertThat(testInterfaceParam.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInterfaceParam.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingInterfaceParam() throws Exception {
        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();
        interfaceParam.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterfaceParamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, interfaceParam.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInterfaceParam() throws Exception {
        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();
        interfaceParam.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterfaceParamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInterfaceParam() throws Exception {
        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();
        interfaceParam.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterfaceParamMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interfaceParam)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInterfaceParamWithPatch() throws Exception {
        // Initialize the database
        interfaceParamRepository.saveAndFlush(interfaceParam);

        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();

        // Update the interfaceParam using partial update
        InterfaceParam partialUpdatedInterfaceParam = new InterfaceParam();
        partialUpdatedInterfaceParam.setId(interfaceParam.getId());

        partialUpdatedInterfaceParam.name(UPDATED_NAME);

        restInterfaceParamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterfaceParam.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterfaceParam))
            )
            .andExpect(status().isOk());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
        InterfaceParam testInterfaceParam = interfaceParamList.get(interfaceParamList.size() - 1);
        assertThat(testInterfaceParam.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInterfaceParam.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateInterfaceParamWithPatch() throws Exception {
        // Initialize the database
        interfaceParamRepository.saveAndFlush(interfaceParam);

        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();

        // Update the interfaceParam using partial update
        InterfaceParam partialUpdatedInterfaceParam = new InterfaceParam();
        partialUpdatedInterfaceParam.setId(interfaceParam.getId());

        partialUpdatedInterfaceParam.name(UPDATED_NAME).value(UPDATED_VALUE);

        restInterfaceParamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterfaceParam.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterfaceParam))
            )
            .andExpect(status().isOk());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
        InterfaceParam testInterfaceParam = interfaceParamList.get(interfaceParamList.size() - 1);
        assertThat(testInterfaceParam.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInterfaceParam.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingInterfaceParam() throws Exception {
        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();
        interfaceParam.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterfaceParamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, interfaceParam.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInterfaceParam() throws Exception {
        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();
        interfaceParam.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterfaceParamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInterfaceParam() throws Exception {
        int databaseSizeBeforeUpdate = interfaceParamRepository.findAll().size();
        interfaceParam.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterfaceParamMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(interfaceParam))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InterfaceParam in the database
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInterfaceParam() throws Exception {
        // Initialize the database
        interfaceParamRepository.saveAndFlush(interfaceParam);

        int databaseSizeBeforeDelete = interfaceParamRepository.findAll().size();

        // Delete the interfaceParam
        restInterfaceParamMockMvc
            .perform(delete(ENTITY_API_URL_ID, interfaceParam.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InterfaceParam> interfaceParamList = interfaceParamRepository.findAll();
        assertThat(interfaceParamList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
