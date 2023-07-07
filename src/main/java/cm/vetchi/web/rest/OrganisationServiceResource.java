package cm.vetchi.web.rest;

import cm.vetchi.domain.OrganisationService;
import cm.vetchi.repository.OrganisationServiceRepository;
import cm.vetchi.service.OrganisationServiceService;
import cm.vetchi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link cm.vetchi.domain.OrganisationService}.
 */
@RestController
@RequestMapping("/api")
public class OrganisationServiceResource {

    private final Logger log = LoggerFactory.getLogger(OrganisationServiceResource.class);

    private static final String ENTITY_NAME = "organisationService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganisationServiceService organisationServiceService;

    private final OrganisationServiceRepository organisationServiceRepository;

    public OrganisationServiceResource(
        OrganisationServiceService organisationServiceService,
        OrganisationServiceRepository organisationServiceRepository
    ) {
        this.organisationServiceService = organisationServiceService;
        this.organisationServiceRepository = organisationServiceRepository;
    }

    /**
     * {@code POST  /organisation-services} : Create a new organisationService.
     *
     * @param organisationService the organisationService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organisationService, or with status {@code 400 (Bad Request)} if the organisationService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organisation-services")
    public ResponseEntity<OrganisationService> createOrganisationService(@RequestBody OrganisationService organisationService)
        throws URISyntaxException {
        log.debug("REST request to save OrganisationService : {}", organisationService);
        if (organisationService.getId() != null) {
            throw new BadRequestAlertException("A new organisationService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrganisationService result = organisationServiceService.save(organisationService);
        return ResponseEntity
            .created(new URI("/api/organisation-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organisation-services/:id} : Updates an existing organisationService.
     *
     * @param id the id of the organisationService to save.
     * @param organisationService the organisationService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organisationService,
     * or with status {@code 400 (Bad Request)} if the organisationService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organisationService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organisation-services/{id}")
    public ResponseEntity<OrganisationService> updateOrganisationService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganisationService organisationService
    ) throws URISyntaxException {
        log.debug("REST request to update OrganisationService : {}, {}", id, organisationService);
        if (organisationService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organisationService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organisationServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrganisationService result = organisationServiceService.update(organisationService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, organisationService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organisation-services/:id} : Partial updates given fields of an existing organisationService, field will ignore if it is null
     *
     * @param id the id of the organisationService to save.
     * @param organisationService the organisationService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organisationService,
     * or with status {@code 400 (Bad Request)} if the organisationService is not valid,
     * or with status {@code 404 (Not Found)} if the organisationService is not found,
     * or with status {@code 500 (Internal Server Error)} if the organisationService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organisation-services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrganisationService> partialUpdateOrganisationService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrganisationService organisationService
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrganisationService partially : {}, {}", id, organisationService);
        if (organisationService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organisationService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organisationServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrganisationService> result = organisationServiceService.partialUpdate(organisationService);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, organisationService.getId().toString())
        );
    }

    /**
     * {@code GET  /organisation-services} : get all the organisationServices.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organisationServices in body.
     */
    @GetMapping("/organisation-services")
    public ResponseEntity<List<OrganisationService>> getAllOrganisationServices(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of OrganisationServices");
        Page<OrganisationService> page;
        if (eagerload) {
            page = organisationServiceService.findAllWithEagerRelationships(pageable);
        } else {
            page = organisationServiceService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /organisation-services/:id} : get the "id" organisationService.
     *
     * @param id the id of the organisationService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organisationService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organisation-services/{id}")
    public ResponseEntity<OrganisationService> getOrganisationService(@PathVariable Long id) {
        log.debug("REST request to get OrganisationService : {}", id);
        Optional<OrganisationService> organisationService = organisationServiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organisationService);
    }

    /**
     * {@code DELETE  /organisation-services/:id} : delete the "id" organisationService.
     *
     * @param id the id of the organisationService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organisation-services/{id}")
    public ResponseEntity<Void> deleteOrganisationService(@PathVariable Long id) {
        log.debug("REST request to delete OrganisationService : {}", id);
        organisationServiceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
