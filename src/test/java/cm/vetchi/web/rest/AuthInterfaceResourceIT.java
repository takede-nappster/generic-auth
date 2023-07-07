package cm.vetchi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cm.vetchi.IntegrationTest;
import cm.vetchi.domain.AuthInterface;
import cm.vetchi.repository.AuthInterfaceRepository;
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
 * Integration tests for the {@link AuthInterfaceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AuthInterfaceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String DEFAULT_DRIVER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_DRIVER_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/auth-interfaces";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuthInterfaceRepository authInterfaceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuthInterfaceMockMvc;

    private AuthInterface authInterface;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuthInterface createEntity(EntityManager em) {
        AuthInterface authInterface = new AuthInterface()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .url(DEFAULT_URL)
            .driverName(DEFAULT_DRIVER_NAME);
        return authInterface;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuthInterface createUpdatedEntity(EntityManager em) {
        AuthInterface authInterface = new AuthInterface()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .url(UPDATED_URL)
            .driverName(UPDATED_DRIVER_NAME);
        return authInterface;
    }

    @BeforeEach
    public void initTest() {
        authInterface = createEntity(em);
    }

    @Test
    @Transactional
    void createAuthInterface() throws Exception {
        int databaseSizeBeforeCreate = authInterfaceRepository.findAll().size();
        // Create the AuthInterface
        restAuthInterfaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authInterface)))
            .andExpect(status().isCreated());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeCreate + 1);
        AuthInterface testAuthInterface = authInterfaceList.get(authInterfaceList.size() - 1);
        assertThat(testAuthInterface.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAuthInterface.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAuthInterface.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testAuthInterface.getDriverName()).isEqualTo(DEFAULT_DRIVER_NAME);
    }

    @Test
    @Transactional
    void createAuthInterfaceWithExistingId() throws Exception {
        // Create the AuthInterface with an existing ID
        authInterface.setId(1L);

        int databaseSizeBeforeCreate = authInterfaceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuthInterfaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authInterface)))
            .andExpect(status().isBadRequest());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAuthInterfaces() throws Exception {
        // Initialize the database
        authInterfaceRepository.saveAndFlush(authInterface);

        // Get all the authInterfaceList
        restAuthInterfaceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(authInterface.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].driverName").value(hasItem(DEFAULT_DRIVER_NAME)));
    }

    @Test
    @Transactional
    void getAuthInterface() throws Exception {
        // Initialize the database
        authInterfaceRepository.saveAndFlush(authInterface);

        // Get the authInterface
        restAuthInterfaceMockMvc
            .perform(get(ENTITY_API_URL_ID, authInterface.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(authInterface.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.driverName").value(DEFAULT_DRIVER_NAME));
    }

    @Test
    @Transactional
    void getNonExistingAuthInterface() throws Exception {
        // Get the authInterface
        restAuthInterfaceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAuthInterface() throws Exception {
        // Initialize the database
        authInterfaceRepository.saveAndFlush(authInterface);

        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();

        // Update the authInterface
        AuthInterface updatedAuthInterface = authInterfaceRepository.findById(authInterface.getId()).get();
        // Disconnect from session so that the updates on updatedAuthInterface are not directly saved in db
        em.detach(updatedAuthInterface);
        updatedAuthInterface.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).url(UPDATED_URL).driverName(UPDATED_DRIVER_NAME);

        restAuthInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAuthInterface.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAuthInterface))
            )
            .andExpect(status().isOk());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
        AuthInterface testAuthInterface = authInterfaceList.get(authInterfaceList.size() - 1);
        assertThat(testAuthInterface.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAuthInterface.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAuthInterface.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testAuthInterface.getDriverName()).isEqualTo(UPDATED_DRIVER_NAME);
    }

    @Test
    @Transactional
    void putNonExistingAuthInterface() throws Exception {
        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();
        authInterface.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, authInterface.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAuthInterface() throws Exception {
        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();
        authInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(authInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAuthInterface() throws Exception {
        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();
        authInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthInterfaceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(authInterface)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuthInterfaceWithPatch() throws Exception {
        // Initialize the database
        authInterfaceRepository.saveAndFlush(authInterface);

        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();

        // Update the authInterface using partial update
        AuthInterface partialUpdatedAuthInterface = new AuthInterface();
        partialUpdatedAuthInterface.setId(authInterface.getId());

        partialUpdatedAuthInterface.url(UPDATED_URL);

        restAuthInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthInterface.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthInterface))
            )
            .andExpect(status().isOk());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
        AuthInterface testAuthInterface = authInterfaceList.get(authInterfaceList.size() - 1);
        assertThat(testAuthInterface.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAuthInterface.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAuthInterface.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testAuthInterface.getDriverName()).isEqualTo(DEFAULT_DRIVER_NAME);
    }

    @Test
    @Transactional
    void fullUpdateAuthInterfaceWithPatch() throws Exception {
        // Initialize the database
        authInterfaceRepository.saveAndFlush(authInterface);

        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();

        // Update the authInterface using partial update
        AuthInterface partialUpdatedAuthInterface = new AuthInterface();
        partialUpdatedAuthInterface.setId(authInterface.getId());

        partialUpdatedAuthInterface.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).url(UPDATED_URL).driverName(UPDATED_DRIVER_NAME);

        restAuthInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuthInterface.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthInterface))
            )
            .andExpect(status().isOk());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
        AuthInterface testAuthInterface = authInterfaceList.get(authInterfaceList.size() - 1);
        assertThat(testAuthInterface.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAuthInterface.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAuthInterface.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testAuthInterface.getDriverName()).isEqualTo(UPDATED_DRIVER_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingAuthInterface() throws Exception {
        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();
        authInterface.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, authInterface.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAuthInterface() throws Exception {
        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();
        authInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(authInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAuthInterface() throws Exception {
        int databaseSizeBeforeUpdate = authInterfaceRepository.findAll().size();
        authInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuthInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(authInterface))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AuthInterface in the database
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAuthInterface() throws Exception {
        // Initialize the database
        authInterfaceRepository.saveAndFlush(authInterface);

        int databaseSizeBeforeDelete = authInterfaceRepository.findAll().size();

        // Delete the authInterface
        restAuthInterfaceMockMvc
            .perform(delete(ENTITY_API_URL_ID, authInterface.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AuthInterface> authInterfaceList = authInterfaceRepository.findAll();
        assertThat(authInterfaceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
