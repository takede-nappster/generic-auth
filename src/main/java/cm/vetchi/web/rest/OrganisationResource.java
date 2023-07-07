package cm.vetchi.web.rest;

import cm.vetchi.domain.Organisation;
import cm.vetchi.repository.OrganisationRepository;
import cm.vetchi.service.OrganisationService;
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
 * REST controller for managing {@link cm.vetchi.domain.Organisation}.
 */
@RestController
@RequestMapping("/api")
public class OrganisationResource {

    private final Logger log = LoggerFactory.getLogger(OrganisationResource.class);

    private static final String ENTITY_NAME = "organisation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganisationService organisationService;

    private final OrganisationRepository organisationRepository;

    public OrganisationResource(OrganisationService organisationService, OrganisationRepository organisationRepository) {
        this.organisationService = organisationService;
        this.organisationRepository = organisationRepository;
    }

    /**
     * {@code POST  /organisations} : Create a new organisation.
     *
     * @param organisation the organisation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organisation, or with status {@code 400 (Bad Request)} if the organisation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organisations")
    public ResponseEntity<Organisation> createOrganisation(@RequestBody Organisation organisation) throws URISyntaxException {
        log.debug("REST request to save Organisation : {}", organisation);
        if (organisation.getId() != null) {
            throw new BadRequestAlertException("A new organisation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Organisation result = organisationService.save(organisation);
        return ResponseEntity
            .created(new URI("/api/organisations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organisations/:id} : Updates an existing organisation.
     *
     * @param id the id of the organisation to save.
     * @param organisation the organisation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organisation,
     * or with status {@code 400 (Bad Request)} if the organisation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organisation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organisations/{id}")
    public ResponseEntity<Organisation> updateOrganisation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Organisation organisation
    ) throws URISyntaxException {
        log.debug("REST request to update Organisation : {}, {}", id, organisation);
        if (organisation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organisation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organisationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Organisation result = organisationService.update(organisation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, organisation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organisations/:id} : Partial updates given fields of an existing organisation, field will ignore if it is null
     *
     * @param id the id of the organisation to save.
     * @param organisation the organisation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organisation,
     * or with status {@code 400 (Bad Request)} if the organisation is not valid,
     * or with status {@code 404 (Not Found)} if the organisation is not found,
     * or with status {@code 500 (Internal Server Error)} if the organisation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organisations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Organisation> partialUpdateOrganisation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Organisation organisation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Organisation partially : {}, {}", id, organisation);
        if (organisation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organisation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organisationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Organisation> result = organisationService.partialUpdate(organisation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, organisation.getId().toString())
        );
    }

    /**
     * {@code GET  /organisations} : get all the organisations.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organisations in body.
     */
    @GetMapping("/organisations")
    public ResponseEntity<List<Organisation>> getAllOrganisations(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Organisations");
        Page<Organisation> page;
        if (eagerload) {
            page = organisationService.findAllWithEagerRelationships(pageable);
        } else {
            page = organisationService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /organisations/:id} : get the "id" organisation.
     *
     * @param id the id of the organisation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organisation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organisations/{id}")
    public ResponseEntity<Organisation> getOrganisation(@PathVariable Long id) {
        log.debug("REST request to get Organisation : {}", id);
        Optional<Organisation> organisation = organisationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organisation);
    }

    /**
     * {@code DELETE  /organisations/:id} : delete the "id" organisation.
     *
     * @param id the id of the organisation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organisations/{id}")
    public ResponseEntity<Void> deleteOrganisation(@PathVariable Long id) {
        log.debug("REST request to delete Organisation : {}", id);
        organisationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
