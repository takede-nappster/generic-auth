package cm.vetchi.web.rest;

import cm.vetchi.domain.Bundle;
import cm.vetchi.repository.BundleRepository;
import cm.vetchi.service.BundleService;
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
 * REST controller for managing {@link cm.vetchi.domain.Bundle}.
 */
@RestController
@RequestMapping("/api")
public class BundleResource {

    private final Logger log = LoggerFactory.getLogger(BundleResource.class);

    private static final String ENTITY_NAME = "bundle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BundleService bundleService;

    private final BundleRepository bundleRepository;

    public BundleResource(BundleService bundleService, BundleRepository bundleRepository) {
        this.bundleService = bundleService;
        this.bundleRepository = bundleRepository;
    }

    /**
     * {@code POST  /bundles} : Create a new bundle.
     *
     * @param bundle the bundle to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bundle, or with status {@code 400 (Bad Request)} if the bundle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bundles")
    public ResponseEntity<Bundle> createBundle(@RequestBody Bundle bundle) throws URISyntaxException {
        log.debug("REST request to save Bundle : {}", bundle);
        if (bundle.getId() != null) {
            throw new BadRequestAlertException("A new bundle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bundle result = bundleService.save(bundle);
        return ResponseEntity
            .created(new URI("/api/bundles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bundles/:id} : Updates an existing bundle.
     *
     * @param id the id of the bundle to save.
     * @param bundle the bundle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bundle,
     * or with status {@code 400 (Bad Request)} if the bundle is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bundle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bundles/{id}")
    public ResponseEntity<Bundle> updateBundle(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bundle bundle)
        throws URISyntaxException {
        log.debug("REST request to update Bundle : {}, {}", id, bundle);
        if (bundle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bundle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bundleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bundle result = bundleService.update(bundle);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bundle.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bundles/:id} : Partial updates given fields of an existing bundle, field will ignore if it is null
     *
     * @param id the id of the bundle to save.
     * @param bundle the bundle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bundle,
     * or with status {@code 400 (Bad Request)} if the bundle is not valid,
     * or with status {@code 404 (Not Found)} if the bundle is not found,
     * or with status {@code 500 (Internal Server Error)} if the bundle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bundles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bundle> partialUpdateBundle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bundle bundle
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bundle partially : {}, {}", id, bundle);
        if (bundle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bundle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bundleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bundle> result = bundleService.partialUpdate(bundle);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bundle.getId().toString())
        );
    }

    /**
     * {@code GET  /bundles} : get all the bundles.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bundles in body.
     */
    @GetMapping("/bundles")
    public ResponseEntity<List<Bundle>> getAllBundles(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Bundles");
        Page<Bundle> page = bundleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bundles/:id} : get the "id" bundle.
     *
     * @param id the id of the bundle to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bundle, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bundles/{id}")
    public ResponseEntity<Bundle> getBundle(@PathVariable Long id) {
        log.debug("REST request to get Bundle : {}", id);
        Optional<Bundle> bundle = bundleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bundle);
    }

    /**
     * {@code DELETE  /bundles/:id} : delete the "id" bundle.
     *
     * @param id the id of the bundle to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bundles/{id}")
    public ResponseEntity<Void> deleteBundle(@PathVariable Long id) {
        log.debug("REST request to delete Bundle : {}", id);
        bundleService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
