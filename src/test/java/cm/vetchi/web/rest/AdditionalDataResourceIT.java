package cm.vetchi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cm.vetchi.IntegrationTest;
import cm.vetchi.domain.AdditionalData;
import cm.vetchi.repository.AdditionalDataRepository;
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
 * Integration tests for the {@link AdditionalDataResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdditionalDataResourceIT {

    private static final String DEFAULT_FIELD_CODE = "AAAAAAAAAA";
    private static final String UPDATED_FIELD_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/additional-data";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdditionalDataRepository additionalDataRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdditionalDataMockMvc;

    private AdditionalData additionalData;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdditionalData createEntity(EntityManager em) {
        AdditionalData additionalData = new AdditionalData().fieldCode(DEFAULT_FIELD_CODE).value(DEFAULT_VALUE);
        return additionalData;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdditionalData createUpdatedEntity(EntityManager em) {
        AdditionalData additionalData = new AdditionalData().fieldCode(UPDATED_FIELD_CODE).value(UPDATED_VALUE);
        return additionalData;
    }

    @BeforeEach
    public void initTest() {
        additionalData = createEntity(em);
    }

    @Test
    @Transactional
    void createAdditionalData() throws Exception {
        int databaseSizeBeforeCreate = additionalDataRepository.findAll().size();
        // Create the AdditionalData
        restAdditionalDataMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isCreated());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeCreate + 1);
        AdditionalData testAdditionalData = additionalDataList.get(additionalDataList.size() - 1);
        assertThat(testAdditionalData.getFieldCode()).isEqualTo(DEFAULT_FIELD_CODE);
        assertThat(testAdditionalData.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createAdditionalDataWithExistingId() throws Exception {
        // Create the AdditionalData with an existing ID
        additionalData.setId(1L);

        int databaseSizeBeforeCreate = additionalDataRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdditionalDataMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdditionalData() throws Exception {
        // Initialize the database
        additionalDataRepository.saveAndFlush(additionalData);

        // Get all the additionalDataList
        restAdditionalDataMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(additionalData.getId().intValue())))
            .andExpect(jsonPath("$.[*].fieldCode").value(hasItem(DEFAULT_FIELD_CODE)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getAdditionalData() throws Exception {
        // Initialize the database
        additionalDataRepository.saveAndFlush(additionalData);

        // Get the additionalData
        restAdditionalDataMockMvc
            .perform(get(ENTITY_API_URL_ID, additionalData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(additionalData.getId().intValue()))
            .andExpect(jsonPath("$.fieldCode").value(DEFAULT_FIELD_CODE))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingAdditionalData() throws Exception {
        // Get the additionalData
        restAdditionalDataMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAdditionalData() throws Exception {
        // Initialize the database
        additionalDataRepository.saveAndFlush(additionalData);

        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();

        // Update the additionalData
        AdditionalData updatedAdditionalData = additionalDataRepository.findById(additionalData.getId()).get();
        // Disconnect from session so that the updates on updatedAdditionalData are not directly saved in db
        em.detach(updatedAdditionalData);
        updatedAdditionalData.fieldCode(UPDATED_FIELD_CODE).value(UPDATED_VALUE);

        restAdditionalDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdditionalData.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdditionalData))
            )
            .andExpect(status().isOk());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
        AdditionalData testAdditionalData = additionalDataList.get(additionalDataList.size() - 1);
        assertThat(testAdditionalData.getFieldCode()).isEqualTo(UPDATED_FIELD_CODE);
        assertThat(testAdditionalData.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingAdditionalData() throws Exception {
        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();
        additionalData.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdditionalDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, additionalData.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdditionalData() throws Exception {
        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();
        additionalData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdditionalDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdditionalData() throws Exception {
        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();
        additionalData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdditionalDataMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(additionalData)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdditionalDataWithPatch() throws Exception {
        // Initialize the database
        additionalDataRepository.saveAndFlush(additionalData);

        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();

        // Update the additionalData using partial update
        AdditionalData partialUpdatedAdditionalData = new AdditionalData();
        partialUpdatedAdditionalData.setId(additionalData.getId());

        partialUpdatedAdditionalData.value(UPDATED_VALUE);

        restAdditionalDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdditionalData.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdditionalData))
            )
            .andExpect(status().isOk());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
        AdditionalData testAdditionalData = additionalDataList.get(additionalDataList.size() - 1);
        assertThat(testAdditionalData.getFieldCode()).isEqualTo(DEFAULT_FIELD_CODE);
        assertThat(testAdditionalData.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateAdditionalDataWithPatch() throws Exception {
        // Initialize the database
        additionalDataRepository.saveAndFlush(additionalData);

        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();

        // Update the additionalData using partial update
        AdditionalData partialUpdatedAdditionalData = new AdditionalData();
        partialUpdatedAdditionalData.setId(additionalData.getId());

        partialUpdatedAdditionalData.fieldCode(UPDATED_FIELD_CODE).value(UPDATED_VALUE);

        restAdditionalDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdditionalData.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdditionalData))
            )
            .andExpect(status().isOk());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
        AdditionalData testAdditionalData = additionalDataList.get(additionalDataList.size() - 1);
        assertThat(testAdditionalData.getFieldCode()).isEqualTo(UPDATED_FIELD_CODE);
        assertThat(testAdditionalData.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingAdditionalData() throws Exception {
        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();
        additionalData.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdditionalDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, additionalData.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdditionalData() throws Exception {
        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();
        additionalData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdditionalDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdditionalData() throws Exception {
        int databaseSizeBeforeUpdate = additionalDataRepository.findAll().size();
        additionalData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdditionalDataMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(additionalData))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdditionalData in the database
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdditionalData() throws Exception {
        // Initialize the database
        additionalDataRepository.saveAndFlush(additionalData);

        int databaseSizeBeforeDelete = additionalDataRepository.findAll().size();

        // Delete the additionalData
        restAdditionalDataMockMvc
            .perform(delete(ENTITY_API_URL_ID, additionalData.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AdditionalData> additionalDataList = additionalDataRepository.findAll();
        assertThat(additionalDataList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
