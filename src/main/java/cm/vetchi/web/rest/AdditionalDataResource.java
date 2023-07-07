package cm.vetchi.web.rest;

import cm.vetchi.domain.AdditionalData;
import cm.vetchi.repository.AdditionalDataRepository;
import cm.vetchi.service.AdditionalDataService;
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
 * REST controller for managing {@link cm.vetchi.domain.AdditionalData}.
 */
@RestController
@RequestMapping("/api")
public class AdditionalDataResource {

    private final Logger log = LoggerFactory.getLogger(AdditionalDataResource.class);

    private static final String ENTITY_NAME = "additionalData";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdditionalDataService additionalDataService;

    private final AdditionalDataRepository additionalDataRepository;

    public AdditionalDataResource(AdditionalDataService additionalDataService, AdditionalDataRepository additionalDataRepository) {
        this.additionalDataService = additionalDataService;
        this.additionalDataRepository = additionalDataRepository;
    }

    /**
     * {@code POST  /additional-data} : Create a new additionalData.
     *
     * @param additionalData the additionalData to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new additionalData, or with status {@code 400 (Bad Request)} if the additionalData has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/additional-data")
    public ResponseEntity<AdditionalData> createAdditionalData(@RequestBody AdditionalData additionalData) throws URISyntaxException {
        log.debug("REST request to save AdditionalData : {}", additionalData);
        if (additionalData.getId() != null) {
            throw new BadRequestAlertException("A new additionalData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AdditionalData result = additionalDataService.save(additionalData);
        return ResponseEntity
            .created(new URI("/api/additional-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /additional-data/:id} : Updates an existing additionalData.
     *
     * @param id the id of the additionalData to save.
     * @param additionalData the additionalData to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated additionalData,
     * or with status {@code 400 (Bad Request)} if the additionalData is not valid,
     * or with status {@code 500 (Internal Server Error)} if the additionalData couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/additional-data/{id}")
    public ResponseEntity<AdditionalData> updateAdditionalData(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdditionalData additionalData
    ) throws URISyntaxException {
        log.debug("REST request to update AdditionalData : {}, {}", id, additionalData);
        if (additionalData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, additionalData.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!additionalDataRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AdditionalData result = additionalDataService.update(additionalData);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, additionalData.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /additional-data/:id} : Partial updates given fields of an existing additionalData, field will ignore if it is null
     *
     * @param id the id of the additionalData to save.
     * @param additionalData the additionalData to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated additionalData,
     * or with status {@code 400 (Bad Request)} if the additionalData is not valid,
     * or with status {@code 404 (Not Found)} if the additionalData is not found,
     * or with status {@code 500 (Internal Server Error)} if the additionalData couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/additional-data/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdditionalData> partialUpdateAdditionalData(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdditionalData additionalData
    ) throws URISyntaxException {
        log.debug("REST request to partial update AdditionalData partially : {}, {}", id, additionalData);
        if (additionalData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, additionalData.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!additionalDataRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdditionalData> result = additionalDataService.partialUpdate(additionalData);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, additionalData.getId().toString())
        );
    }

    /**
     * {@code GET  /additional-data} : get all the additionalData.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of additionalData in body.
     */
    @GetMapping("/additional-data")
    public ResponseEntity<List<AdditionalData>> getAllAdditionalData(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of AdditionalData");
        Page<AdditionalData> page = additionalDataService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /additional-data/:id} : get the "id" additionalData.
     *
     * @param id the id of the additionalData to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the additionalData, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/additional-data/{id}")
    public ResponseEntity<AdditionalData> getAdditionalData(@PathVariable Long id) {
        log.debug("REST request to get AdditionalData : {}", id);
        Optional<AdditionalData> additionalData = additionalDataService.findOne(id);
        return ResponseUtil.wrapOrNotFound(additionalData);
    }

    /**
     * {@code DELETE  /additional-data/:id} : delete the "id" additionalData.
     *
     * @param id the id of the additionalData to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/additional-data/{id}")
    public ResponseEntity<Void> deleteAdditionalData(@PathVariable Long id) {
        log.debug("REST request to delete AdditionalData : {}", id);
        additionalDataService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
