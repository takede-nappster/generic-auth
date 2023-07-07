package cm.vetchi.web.rest;

import cm.vetchi.domain.InterfaceParam;
import cm.vetchi.repository.InterfaceParamRepository;
import cm.vetchi.service.InterfaceParamService;
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
 * REST controller for managing {@link cm.vetchi.domain.InterfaceParam}.
 */
@RestController
@RequestMapping("/api")
public class InterfaceParamResource {

    private final Logger log = LoggerFactory.getLogger(InterfaceParamResource.class);

    private static final String ENTITY_NAME = "interfaceParam";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InterfaceParamService interfaceParamService;

    private final InterfaceParamRepository interfaceParamRepository;

    public InterfaceParamResource(InterfaceParamService interfaceParamService, InterfaceParamRepository interfaceParamRepository) {
        this.interfaceParamService = interfaceParamService;
        this.interfaceParamRepository = interfaceParamRepository;
    }

    /**
     * {@code POST  /interface-params} : Create a new interfaceParam.
     *
     * @param interfaceParam the interfaceParam to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new interfaceParam, or with status {@code 400 (Bad Request)} if the interfaceParam has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/interface-params")
    public ResponseEntity<InterfaceParam> createInterfaceParam(@RequestBody InterfaceParam interfaceParam) throws URISyntaxException {
        log.debug("REST request to save InterfaceParam : {}", interfaceParam);
        if (interfaceParam.getId() != null) {
            throw new BadRequestAlertException("A new interfaceParam cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InterfaceParam result = interfaceParamService.save(interfaceParam);
        return ResponseEntity
            .created(new URI("/api/interface-params/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /interface-params/:id} : Updates an existing interfaceParam.
     *
     * @param id the id of the interfaceParam to save.
     * @param interfaceParam the interfaceParam to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interfaceParam,
     * or with status {@code 400 (Bad Request)} if the interfaceParam is not valid,
     * or with status {@code 500 (Internal Server Error)} if the interfaceParam couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/interface-params/{id}")
    public ResponseEntity<InterfaceParam> updateInterfaceParam(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InterfaceParam interfaceParam
    ) throws URISyntaxException {
        log.debug("REST request to update InterfaceParam : {}, {}", id, interfaceParam);
        if (interfaceParam.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interfaceParam.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interfaceParamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InterfaceParam result = interfaceParamService.update(interfaceParam);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, interfaceParam.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /interface-params/:id} : Partial updates given fields of an existing interfaceParam, field will ignore if it is null
     *
     * @param id the id of the interfaceParam to save.
     * @param interfaceParam the interfaceParam to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interfaceParam,
     * or with status {@code 400 (Bad Request)} if the interfaceParam is not valid,
     * or with status {@code 404 (Not Found)} if the interfaceParam is not found,
     * or with status {@code 500 (Internal Server Error)} if the interfaceParam couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/interface-params/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InterfaceParam> partialUpdateInterfaceParam(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InterfaceParam interfaceParam
    ) throws URISyntaxException {
        log.debug("REST request to partial update InterfaceParam partially : {}, {}", id, interfaceParam);
        if (interfaceParam.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interfaceParam.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interfaceParamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InterfaceParam> result = interfaceParamService.partialUpdate(interfaceParam);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, interfaceParam.getId().toString())
        );
    }

    /**
     * {@code GET  /interface-params} : get all the interfaceParams.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of interfaceParams in body.
     */
    @GetMapping("/interface-params")
    public ResponseEntity<List<InterfaceParam>> getAllInterfaceParams(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of InterfaceParams");
        Page<InterfaceParam> page = interfaceParamService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /interface-params/:id} : get the "id" interfaceParam.
     *
     * @param id the id of the interfaceParam to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the interfaceParam, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/interface-params/{id}")
    public ResponseEntity<InterfaceParam> getInterfaceParam(@PathVariable Long id) {
        log.debug("REST request to get InterfaceParam : {}", id);
        Optional<InterfaceParam> interfaceParam = interfaceParamService.findOne(id);
        return ResponseUtil.wrapOrNotFound(interfaceParam);
    }

    /**
     * {@code DELETE  /interface-params/:id} : delete the "id" interfaceParam.
     *
     * @param id the id of the interfaceParam to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/interface-params/{id}")
    public ResponseEntity<Void> deleteInterfaceParam(@PathVariable Long id) {
        log.debug("REST request to delete InterfaceParam : {}", id);
        interfaceParamService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
