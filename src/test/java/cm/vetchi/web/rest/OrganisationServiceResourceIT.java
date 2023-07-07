package cm.vetchi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cm.vetchi.IntegrationTest;
import cm.vetchi.domain.OrganisationService;
import cm.vetchi.repository.OrganisationServiceRepository;
import cm.vetchi.service.OrganisationServiceService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrganisationServiceResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OrganisationServiceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/organisation-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrganisationServiceRepository organisationServiceRepository;

    @Mock
    private OrganisationServiceRepository organisationServiceRepositoryMock;

    @Mock
    private OrganisationServiceService organisationServiceServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganisationServiceMockMvc;

    private OrganisationService organisationService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganisationService createEntity(EntityManager em) {
        OrganisationService organisationService = new OrganisationService().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return organisationService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganisationService createUpdatedEntity(EntityManager em) {
        OrganisationService organisationService = new OrganisationService().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return organisationService;
    }

    @BeforeEach
    public void initTest() {
        organisationService = createEntity(em);
    }

    @Test
    @Transactional
    void createOrganisationService() throws Exception {
        int databaseSizeBeforeCreate = organisationServiceRepository.findAll().size();
        // Create the OrganisationService
        restOrganisationServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isCreated());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeCreate + 1);
        OrganisationService testOrganisationService = organisationServiceList.get(organisationServiceList.size() - 1);
        assertThat(testOrganisationService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOrganisationService.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createOrganisationServiceWithExistingId() throws Exception {
        // Create the OrganisationService with an existing ID
        organisationService.setId(1L);

        int databaseSizeBeforeCreate = organisationServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganisationServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrganisationServices() throws Exception {
        // Initialize the database
        organisationServiceRepository.saveAndFlush(organisationService);

        // Get all the organisationServiceList
        restOrganisationServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organisationService.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOrganisationServicesWithEagerRelationshipsIsEnabled() throws Exception {
        when(organisationServiceServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOrganisationServiceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(organisationServiceServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOrganisationServicesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(organisationServiceServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOrganisationServiceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(organisationServiceServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getOrganisationService() throws Exception {
        // Initialize the database
        organisationServiceRepository.saveAndFlush(organisationService);

        // Get the organisationService
        restOrganisationServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, organisationService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organisationService.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingOrganisationService() throws Exception {
        // Get the organisationService
        restOrganisationServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrganisationService() throws Exception {
        // Initialize the database
        organisationServiceRepository.saveAndFlush(organisationService);

        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();

        // Update the organisationService
        OrganisationService updatedOrganisationService = organisationServiceRepository.findById(organisationService.getId()).get();
        // Disconnect from session so that the updates on updatedOrganisationService are not directly saved in db
        em.detach(updatedOrganisationService);
        updatedOrganisationService.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restOrganisationServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganisationService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrganisationService))
            )
            .andExpect(status().isOk());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
        OrganisationService testOrganisationService = organisationServiceList.get(organisationServiceList.size() - 1);
        assertThat(testOrganisationService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOrganisationService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingOrganisationService() throws Exception {
        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();
        organisationService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganisationServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organisationService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganisationService() throws Exception {
        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();
        organisationService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganisationServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganisationService() throws Exception {
        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();
        organisationService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganisationServiceMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganisationServiceWithPatch() throws Exception {
        // Initialize the database
        organisationServiceRepository.saveAndFlush(organisationService);

        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();

        // Update the organisationService using partial update
        OrganisationService partialUpdatedOrganisationService = new OrganisationService();
        partialUpdatedOrganisationService.setId(organisationService.getId());

        partialUpdatedOrganisationService.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restOrganisationServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganisationService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganisationService))
            )
            .andExpect(status().isOk());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
        OrganisationService testOrganisationService = organisationServiceList.get(organisationServiceList.size() - 1);
        assertThat(testOrganisationService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOrganisationService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateOrganisationServiceWithPatch() throws Exception {
        // Initialize the database
        organisationServiceRepository.saveAndFlush(organisationService);

        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();

        // Update the organisationService using partial update
        OrganisationService partialUpdatedOrganisationService = new OrganisationService();
        partialUpdatedOrganisationService.setId(organisationService.getId());

        partialUpdatedOrganisationService.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restOrganisationServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganisationService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganisationService))
            )
            .andExpect(status().isOk());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
        OrganisationService testOrganisationService = organisationServiceList.get(organisationServiceList.size() - 1);
        assertThat(testOrganisationService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOrganisationService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingOrganisationService() throws Exception {
        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();
        organisationService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganisationServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organisationService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganisationService() throws Exception {
        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();
        organisationService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganisationServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganisationService() throws Exception {
        int databaseSizeBeforeUpdate = organisationServiceRepository.findAll().size();
        organisationService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganisationServiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organisationService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganisationService in the database
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganisationService() throws Exception {
        // Initialize the database
        organisationServiceRepository.saveAndFlush(organisationService);

        int databaseSizeBeforeDelete = organisationServiceRepository.findAll().size();

        // Delete the organisationService
        restOrganisationServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, organisationService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrganisationService> organisationServiceList = organisationServiceRepository.findAll();
        assertThat(organisationServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
