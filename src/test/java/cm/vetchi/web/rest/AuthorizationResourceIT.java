package cm.vetchi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cm.vetchi.IntegrationTest;
import cm.vetchi.domain.Authorization;
import cm.vetchi.repository.AuthorizationRepository;
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
 * Integration tests for the {@link AuthorizationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AuthorizationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/authorizations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuthorizationRepository authorizationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuthorizationMockMvc;

    private Authorization authorization;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Authorization createEntity(EntityManager em) {
        Authorization authorization = new Authorization().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).code(DEFAULT_CODE);
        return authorization;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Authorization createUpdatedEntity(EntityManager em) {
        Authorization authorization = new Authorization().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).code(UPDATED_CODE);
        return authorization;
    }

    @BeforeEach
    public void initTest() {
        authorization = createEntity(em);
    }

    @Test
    @Transactional
    void createAuthorization() throws Exception {
        int databaseSizeBeforeCreate = authorizationRepository.findAll().size();
        // Create the Authorization
        restAuthorizationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authorization)))
            .andExpect(status().isCreated());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeCreate + 1);
        Authorization testAuthorization = authorizationList.get(authorizationList.size() - 1);
        assertThat(testAuthorization.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAuthorization.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAuthorization.getCode()).isEqualTo(DEFAULT_CODE);
    }

    @Test
    @Transactional
    void createAuthorizationWithExistingId() throws Exception {
        // Create the Authorization with an existing ID
        authorization.setId(1L);

        int databaseSizeBeforeCreate = authorizationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuthorizationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authorization)))
            .andExpect(status().isBadRequest());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAuthorizations() throws Exception {
        // Initialize the database
        authorizationRepository.saveAndFlush(authorization);

        // Get all the authorizationList
        restAuthorizationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(authorization.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)));
    }

    @Test
    @Transactional
    void getAuthorization() throws Exception {
        // Initialize the database
        authorizationRepository.saveAndFlush(authorization);

        // Get the authorization
        restAuthorizationMockMvc
            .perform(get(ENTITY_API_URL_ID, authorization.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(authorization.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE));
    }

    @Test
    @Transactional
    void getNonExistingAuthorization() throws Exception {
        // Get the authorization
        restAuthorizationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAuthorization() throws Exception {
        // Initialize the database
        authorizationRepository.saveAndFlush(authorization);

        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();

        // Update the authorization
        Authorization updatedAuthorization = authorizationRepository.findById(authorization.getId()).get();
        // Disconnect from session so that the updates on updatedAuthorization are not directly saved in db
        em.detach(updatedAuthorization);
        updatedAuthorization.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).code(UPDATED_CODE);

        restAuthorizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAuthorization.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAuthorization))
            )
            .andExpect(status().isOk());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
        Authorization testAuthorization = authorizationList.get(authorizationList.size() - 1);
        assertThat(testAuthorization.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAuthorization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAuthorization.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void putNonExistingAuthorization() throws Exception {
        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();
        authorization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthorizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, authorization.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authorization))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAuthorization() throws Exception {
        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();
        authorization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthorizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authorization))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAuthorization() throws Exception {
        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();
        authorization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthorizationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authorization)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuthorizationWithPatch() throws Exception {
        // Initialize the database
        authorizationRepository.saveAndFlush(authorization);

        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();

        // Update the authorization using partial update
        Authorization partialUpdatedAuthorization = new Authorization();
        partialUpdatedAuthorization.setId(authorization.getId());

        partialUpdatedAuthorization.code(UPDATED_CODE);

        restAuthorizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthorization.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthorization))
            )
            .andExpect(status().isOk());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
        Authorization testAuthorization = authorizationList.get(authorizationList.size() - 1);
        assertThat(testAuthorization.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAuthorization.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAuthorization.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void fullUpdateAuthorizationWithPatch() throws Exception {
        // Initialize the database
        authorizationRepository.saveAndFlush(authorization);

        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();

        // Update the authorization using partial update
        Authorization partialUpdatedAuthorization = new Authorization();
        partialUpdatedAuthorization.setId(authorization.getId());

        partialUpdatedAuthorization.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).code(UPDATED_CODE);

        restAuthorizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthorization.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthorization))
            )
            .andExpect(status().isOk());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
        Authorization testAuthorization = authorizationList.get(authorizationList.size() - 1);
        assertThat(testAuthorization.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAuthorization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAuthorization.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void patchNonExistingAuthorization() throws Exception {
        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();
        authorization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthorizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, authorization.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authorization))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAuthorization() throws Exception {
        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();
        authorization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthorizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authorization))
            )
            .andExpect(status().isBadRequest());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAuthorization() throws Exception {
        int databaseSizeBeforeUpdate = authorizationRepository.findAll().size();
        authorization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthorizationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(authorization))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Authorization in the database
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAuthorization() throws Exception {
        // Initialize the database
        authorizationRepository.saveAndFlush(authorization);

        int databaseSizeBeforeDelete = authorizationRepository.findAll().size();

        // Delete the authorization
        restAuthorizationMockMvc
            .perform(delete(ENTITY_API_URL_ID, authorization.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Authorization> authorizationList = authorizationRepository.findAll();
        assertThat(authorizationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
