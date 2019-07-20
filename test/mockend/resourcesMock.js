module.exports = {
  getResource: function(id) {
    return resources.filter(r => r.id == id)[0]
  },

  createResource: function(resource) {
    console.log(resource)
  },

  findResources: function(queryParams) {
    const scopeFilter = Object.keys(queryParams).filter(
      k => k !== "page" && k !== "pr_page" && k !== "type" && k !== "status" && k !== "alias"
    )
    const typeFilter = queryParams.type
    const lifecycleFilter = queryParams.status
    const aliasFilter = queryParams.alias

    function byAlias(r) {
      return aliasFilter ? r.alias.toLowerCase() === aliasFilter.toLowerCase() : true
    }

    function byType(r) {
      return typeFilter ? r.type.toLowerCase() === typeFilter.toLowerCase() : true
    }

    function byLifecycleStatus(s) {
      return lifecycleFilter
        ? Object.keys(s.lifecycle).length > 0 &&
            s.lifecycle.status.toLowerCase() === lifecycleFilter.toLowerCase()
        : true
    }

    function byScope(r) {
      let result = true
      scopeFilter.forEach(filter => {
        if (r.scope[filter] !== queryParams[filter]) {
          result = false
        }
      })

      return result
    }

    return resources
      .filter(byLifecycleStatus)
      .filter(byType)
      .filter(byAlias)
      .filter(byScope)
  },

  deleteresource: function(id) {
    resources.splice(resources.findIndex(e => e.id == id), 1)
  }
}

const resources = [
  {
    type: "baseurl",
    alias: "tjenestebuss",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q3"
    },
    properties: {
      url: "https://servicebus.se/"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 1,
    created: "2013-08-08T09:02:59.312",
    updated: "2013-08-08T09:02:59.312",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/1",
      revisions: "http://localhost:9696/resources/1/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "rutingaddress_ws",
    scope: {
      environmentclass: "t",
      zone: "fss",
      environment: "t4"
    },
    properties: {
      url: "https://reallyfancy.url.to.a.host.jp/"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 2,
    created: "2014-04-29T10:51:55.491",
    updated: "2014-04-29T10:51:55.491",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "t",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/2",
      revisions: "http://localhost:9696/resources/2/revisions"
    }
  },
  {
    type: "deploymentmanager",
    alias: "wasDmgr",
    scope: {
      environmentclass: "t",
      zone: "fss",
      environment: "t1"
    },
    properties: {
      hostname: "damager.no",
      username: "superduperadminuser"
    },
    secrets: {
      password: {
        ref: "http://localhost:9696/secrets/358660"
      }
    },
    files: {},
    dodgy: false,
    id: 358659,
    created: "2014-04-16T11:45:00.633",
    updated: "2014-04-16T11:45:00.633",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "t",
      adgroups: []
    },
    links: {
      self: "https://fasit.adeo.no/api/v2/resources/358659",
      revisions: "https://fasit.adeo.no/api/v2/resources/358659/revisions"
    }
  },
  {
    type: "queue",
    alias: "RAY.AMELDING",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "qx",
      application: "ytelsesrapportering"
    },
    properties: {
      queueName: "QA.THIS.IS.THE.NAME.OF.A.QUEUE"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 3,
    created: "2015-08-10T09:25:48.244",
    updated: "2015-08-10T09:25:48.244",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/3",
      revisions: "http://localhost:9696/resources/3/revisions"
    }
  },
  {
    type: "webserviceendpoint",
    alias: "domene.Brukerdialog:henvendelsesbehandlingservice_v1",
    scope: {
      environmentclass: "u",
      zone: "fss",
      environment: "u1"
    },
    properties: {
      securityToken: "OTHER",
      endpointUrl: "http://www.vg.no",
      wsdlUrl: "http://maven.com./nexus/path/etc/wsdl.zip"
    },
    exposedby: {
      application: "app1",
      environment: "u69",
      version: "2.10.3",
      id: 404,
      ref: "http://localhost:6969/mockapi/applicationinstances/404"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 4,
    created: "2013-10-08T12:30:23.916",
    updated: "2013-10-08T12:30:23.916",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:6969/resources/4",
      revisions: "http://localhost:6969/resources/4/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "FGSakProxy.provider",
    scope: {
      environmentclass: "p",
      zone: "fss",
      application: "bprof"
    },
    properties: {
      url: "iiop://localhost:9812"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 5,
    created: "2014-12-02T09:55:03.724",
    updated: "2014-12-02T09:55:03.724",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/5",
      revisions: "http://localhost:9696/resources/5/revisions"
    }
  },
  {
    type: "applicationproperties",
    alias: "tpsws.properties",
    scope: {
      environmentclass: "q",
      zone: "fss",
      application: "tpsws"
    },
    properties: {
      applicationProperties:
        "log.level.no.nav=WARN\r\nno.stelvio.level=WARN\r\norg.springframework.level=WARN\r\nno.stelvio.common.level=WARN\r\nlog.level.toTPS.level=WARN\r\nlog.level.fromTPS.level=WARN\r\nno.nav.tpsws.JAMON.level=WARN\r\ndiskresjonskodesoek.timeout=10000"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 14,
    created: "2014-04-30T09:30:44.118",
    updated: "2014-06-16T10:16:54.505",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/14",
      revisions: "http://localhost:9696/resources/14/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "personkortet",
    scope: {
      environmentclass: "q",
      application: "pensjon-fss"
    },
    properties: {
      url: "http://some.url.com"
    },
    secrets: {},
    files: {},
    dodgy: true,
    id: 17,
    created: "2014-04-30T11:06:13.686",
    updated: "2015-04-10T15:44:31.147",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/17",
      revisions: "http://localhost:9696/resources/17/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "foreldrepengerBackendEndpoint",
    scope: {
      environmentclass: "p",
      zone: "fss",
      environment: "p"
    },
    properties: {
      url: "https://app.com"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 18,
    created: "2013-10-11T07:40:43.106",
    updated: "2013-10-11T07:40:43.106",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/18",
      revisions: "http://localhost:9696/resources/18/revisions"
    }
  },
  {
    type: "applicationproperties",
    alias: "bjoark012DlfQueue",
    scope: {
      environmentclass: "u",
      zone: "fss",
      environment: "u3",
      application: "joark"
    },
    properties: {
      applicationProperties: "app.prop.1:propvalue"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 19,
    created: "2014-12-02T12:07:33.4",
    updated: "2015-10-08T08:39:25.933",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/19",
      revisions: "http://localhost:9696/resources/19/revisions"
    }
  },
  {
    type: "applicationproperties",
    alias: "bjoark012DlfVedleggQueue",
    scope: {
      environmentclass: "u",
      zone: "fss",
      environment: "u3",
      application: "joark"
    },
    properties: {
      applicationProperties: "app.props.something=some kins of value"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 20,
    created: "2014-12-02T12:08:08.159",
    updated: "2015-10-08T08:39:22.747",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/20",
      revisions: "http://localhost:9696/resources/20/revisions"
    }
  },
  {
    type: "certificate",
    alias: "srvAktoerid",
    scope: {
      environmentclass: "t",
      zone: "fss",
      application: "aktoerid"
    },
    properties: {
      keystorealias: "app-key"
    },
    secrets: {
      keystorepassword: {
        ref: "http://localhost:6969/mockapi/secrets/242159"
      }
    },
    files: {
      keystore: {
        filename: "keystore",
        ref: "https://fasit.adeo.no/api/v2/resources/242157/file/keystore"
      }
    },
    dodgy: false,
    id: 21,
    created: "2013-10-10T11:13:26.595",
    updated: "2013-10-10T11:13:26.595",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "t",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/21",
      revisions: "http://localhost:9696/resources/21/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "elektronisk_samhandling:abonnement-nav-inntekt",
    scope: {
      environmentclass: "p",
      zone: "fss",
      environment: "p",
      application: "inntektskomponenten"
    },
    properties: {
      url: "https://elsamurl.com"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 22,
    created: "2014-12-03T10:17:02.298",
    updated: "2014-12-03T10:17:02.298",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/22",
      revisions: "http://localhost:9696/resources/22/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "mininnboks.itjenester.link",
    scope: {
      environmentclass: "t",
      zone: "sbs",
      environment: "t8"
    },
    properties: {
      url: "https://innboksservice"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 23,
    created: "2015-08-11T12:39:05.339",
    updated: "2015-08-11T12:39:05.339",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "t",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/23",
      revisions: "http://localhost:9696/resources/23/revisions"
    }
  },
  {
    type: "datasource",
    alias: "vaultTestDataSource",
    scope: {
      environmentclass: "q",
      zone: "sbs",
      application: "yrkesveileder2"
    },
    properties: {
      url:
          "jdbc:oracle:thin:@(DESCRIPTION=(FAILOVER=on)(CONNECT_TIMEOUT= 15)(RETRY_COUNT=20)(RETRY_DELAY=3)(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=databaseserver.com)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=databaserserver2.com)(PORT=1522)))(CONNECT_DATA=(SERVICE_NAME=testdb_ha)))",
      username: "db_user2"
    },
    secrets: {
      password: {
        vaultpath: "oracle/data/dev/creds/inst_q8-user/password",
        ref: "http://localhost:6969/mockapi/secrets/771398"
      }
    },
    files: {},
    dodgy: false,
    id: 24,
    created: "2014-12-03T13:40:30.974",
    updated: "2014-12-03T13:40:30.974",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/24",
      revisions: "http://localhost:9696/resources/24/revisions"
    }
  },
  {
    type: "datasource",
    alias: "skikkelig.lang.url.til.datasource",
    scope: {
      environmentclass: "q",
      zone: "sbs",
      application: "yrkesveileder"
    },
    properties: {
      url:
        "jdbc:oracle:thin:@(DESCRIPTION=(FAILOVER=on)(CONNECT_TIMEOUT= 15)(RETRY_COUNT=20)(RETRY_DELAY=3)(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=databaseserver.com)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=databaserserver2.com)(PORT=1522)))(CONNECT_DATA=(SERVICE_NAME=testdb_ha)))",
      username: "db_user"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/771397"
      }
    },
    files: {},
    dodgy: false,
    id: 24,
    created: "2014-12-03T13:40:30.974",
    updated: "2014-12-03T13:40:30.974",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/24",
      revisions: "http://localhost:9696/resources/24/revisions"
    }
  },
  {
    type: "credential",
    alias: "srv_esso-ver",
    scope: {
      environmentclass: "p",
      zone: "sbs",
      application: "esso-ver"
    },
    properties: {
      username: "someuser"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/242389"
      }
    },
    files: {},
    dodgy: false,
    id: 25,
    created: "2013-10-10T14:44:59.707",
    updated: "2013-10-10T14:44:59.707",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/25",
      revisions: "http://localhost:9696/resources/25/revisions"
    }
  },
  {
    type: "baseurl",
    alias: "sykepengerBackendEndpoint",
    scope: {
      environmentclass: "p",
      zone: "fss",
      environment: "p"
    },
    properties: {
      url: "http://anotherurl"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 26,
    created: "2013-10-11T07:41:17.204",
    updated: "2013-10-11T07:41:17.204",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/26",
      revisions: "http://localhost:9696/resources/26/revisions"
    }
  },
  {
    type: "credential",
    alias: "Brevklient",
    scope: {
      environmentclass: "p"
    },
    properties: {
      username: "somevalue"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/771549"
      }
    },
    files: {},
    dodgy: false,
    id: 27,
    created: "2014-12-03T14:23:59.668",
    updated: "2014-12-03T14:23:59.668",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/27",
      revisions: "http://localhost:9696/resources/27/revisions"
    }
  },
  {
    type: "queue",
    alias: "EREG_IAFLAGG",
    scope: {
      environmentclass: "q",
      environment: "q5"
    },
    properties: {
      queueName: "A.QUEUE.NAME"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 28,
    created: "2014-12-04T07:23:23.53",
    updated: "2014-12-04T07:23:23.53",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/28",
      revisions: "http://localhost:9696/resources/28/revisions"
    }
  },
  {
    type: "datasource",
    alias: "instDataSource",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q8",
      application: "inst"
    },
    properties: {
      url: "jdbc:oracle:thin:@dbserver2.com",
      username: "dbuser2"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/1729516"
      }
    },
    files: {},
    dodgy: false,
    id: 29,
    created: "2015-08-13T09:22:40.824",
    updated: "2015-08-13T09:22:40.824",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/29",
      revisions: "http://localhost:9696/resources/29/revisions"
    }
  },
  {
    type: "applicationproperties",
    alias: "dokprod.threadPoolProperties",
    scope: {
      environmentclass: "p",
      zone: "fss",
      environment: "p",
      application: "dokprod"
    },
    properties: {
      applicationProperties:
        "threadpooltaskexecutor.corepoolsize=5\r\nthreadpooltaskexecutor.maxpoolsize=10\r\nthreadpooltaskexecutor.queuecapacity=500"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 30,
    created: "2014-12-05T16:28:52.19",
    updated: "2014-12-05T16:28:52.19",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/30",
      revisions: "http://localhost:9696/resources/30/revisions"
    }
  },
  {
    type: "webserviceendpoint",
    alias: "virksomhet:PipErEgenAnsatt_v1",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q3"
    },
    properties: {
      securityToken: "OTHER",
      endpointUrl: "https://thisisurl",
      wsdlUrl: "http://maven.com/path.to.artifact.zip"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 31,
    created: "2013-08-09T12:36:11.306",
    updated: "2013-08-09T12:36:11.306",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/31",
      revisions: "http://localhost:9696/resources/31/revisions"
    }
  },
  {
    type: "soapservice",
    alias: "somekindofsoapservice",
    scope: {
      environmentclass: "q"
    },
    properties: {
      securityToken: "NONE",
      endpointUrl: "https://thisissoap.com",
      wsdlUrl: "http://maven.com/path.to.artifact.zip"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 43,
    created: "2013-08-09T12:36:11.306",
    updated: "2013-08-09T12:36:11.306",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/43",
      revisions: "http://localhost:9696/resources/43/revisions"
    }
  },
  {
    type: "queue",
    alias: "A_COOL_QUEUE_NAME",
    scope: {
      environmentclass: "t",
      zone: "fss",
      environment: "t4",
      application: "sakogbehandling"
    },
    properties: {
      queueName: "A_COOL_QUEUE_NAME"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 32,
    created: "2015-08-13T12:28:00.664",
    updated: "2015-08-13T12:28:00.664",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "t",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/32",
      revisions: "http://localhost:9696/resources/32/revisions"
    }
  },
  {
    type: "azureoidc",
    alias: "aztotheure",
    scope: {
      environmentclass: "u",
      zone: "fss"
    },
    properties: {
      clientId: "clientID",
      callbackUri: "http://callback.com",
      discoveryUri: "http://discoverychannel.com"
    },
    secrets: {
      clientSecret: {
        ref: "https://fasit.adeo.no/api/v2/secrets/5244747"
      }
    },
    files: {},
    usedbyapplications: [],
    dodgy: false,
    id: 5244746,
    revision: 5244748,
    created: "2018-06-26T15:51:42.6",
    updated: "2018-06-26T15:51:42.6",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    links: {
      self: "https://fasit.adeo.no/api/v2/resources/5244746",
      revisions: "https://fasit.adeo.no/api/v2/resources/5244746/revisions"
    }
  },
  {
    type: "credential",
    alias: "srvsaksoversikt",
    scope: {
      environmentclass: "u",
      zone: "fss",
      application: "saksoversikt"
    },
    properties: {
      username: "someusername"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/373797"
      }
    },
    files: {},
    dodgy: false,
    id: 33,
    created: "2014-05-06T08:12:44.181",
    updated: "2014-05-06T08:12:44.181",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/33",
      revisions: "http://localhost:9696/resources/33/revisions"
    }
  },
  {
    type: "applicationproperties",
    alias: "preg-logging",
    scope: {
      environmentclass: "u",
      zone: "fss"
    },
    properties: {
      applicationProperties:
        "preg.log4j.loglevel.no.nav=DEBUG\r\npreg.log4.loglevel.no.nav.config.pensjon.regler=DEBUG\r\npreg.log4j.loglevel.log4j.logger.no.nav.domain.pensjon.regler=DEBUG\r\npreg.log4j.loglevel.log4j.logger.no.nav.service.pensjon.regler=DEBUG\r\npreg.log4j.loglevel.no.nav.test.pensjon.regler=DEBUG\r\npreg.log4j.loglevel.PREGRequest=DEBUG\r\npreg.log4j.loglevel.PREGResponse=DEBUG"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 34,
    created: "2014-05-06T16:44:13.592",
    updated: "2016-12-15T12:26:01.82",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/34",
      revisions: "http://localhost:9696/resources/34/revisions"
    }
  },
  {
    type: "certificate",
    alias: "somesrvUser",
    scope: {
      environmentclass: "t"
    },
    properties: {
      keystorealias: "app-key"
    },
    secrets: {
      keystorepassword: {
        ref: "http://localhost:6969/mockapi/secrets/3512"
      }
    },
    files: {
      keystore: {
        filename: "keystore",
        ref: "https://fasit.adeo.no/api/v2/resources/3510/file/keystore"
      }
    },
    dodgy: false,
    id: 35,
    created: "2013-04-11T16:42:29.39",
    updated: "2015-12-08T08:12:59.438",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "t",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/35",
      revisions: "http://localhost:9696/resources/35/revisions"
    }
  },
  {
    type: "queuemanager",
    alias: "APP_MQMANAGER",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q1",
      application: "elin"
    },
    properties: {
      hostname: "queuemanager.host.com",
      port: "6969",
      name: "QMNAME"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 36,
    created: "2015-10-07T13:26:47.842",
    updated: "2015-10-07T13:26:47.842",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/36",
      revisions: "http://localhost:9696/resources/36/revisions"
    }
  },
  {
    type: "restservice",
    alias: "arbeidRestService",
    scope: {
      environmentclass: "q",
      zone: "sbs",
      environment: "q1",
      application: "stillinger"
    },
    properties: {
      description: "Rest tjeneste",
      url: "https://some.rest.service.com/some/path"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 37,
    created: "2015-04-21T15:41:55.303",
    updated: "2016-06-09T08:40:14.166",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/37",
      revisions: "http://localhost:9696/resources/37/revisions"
    }
  },
  {
    type: "ejb",
    alias: "someejb",
    scope: {
      environmentclass: "q",
      environment: "q6"
    },
    properties: {
      jndi: "ejb/no/provider/HomeIface",
      providerUrl: "iiop://ejbhost.com:4242/"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 38,
    created: "2015-04-23T14:00:17.453",
    updated: "2015-07-24T07:17:20.838",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/38",
      revisions: "http://localhost:9696/resources/38/revisions"
    }
  },
  {
    type: "queue",
    alias: "queuealias",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q1",
      application: "elin"
    },
    properties: {
      queueName: "QA.A_QUEUE_NAME_HERE"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 39,
    created: "2015-10-07T13:32:45.802",
    updated: "2015-10-07T13:32:45.802",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/39",
      revisions: "http://localhost:9696/resources/39/revisions"
    }
  },
  {
    type: "db2datasource",
    alias: "db2ds",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q8",
      application: "gosys"
    },
    properties: {
      schema: "DB2schemaname",
      hostname: "db2.host.net",
      port: "2222",
      dbaname: "DB2Inst",
      username: "db2user"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/378545"
      }
    },
    files: {},
    lifecyclestatus: "stopped",
    dodgy: false,
    id: 40,
    created: "2014-05-08T14:54:47.347",
    updated: "2016-11-10T09:40:42.029",
    lifecycle: {
      status: "stopped",
      nextactiondate: "2017-02-08T09:40:42.029",
      issue: "AURAGC-5862"
    },
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/40",
      revisions: "http://localhost:9696/resources/40/revisions"
    }
  },
  {
    type: "cics",
    alias: "acics",
    scope: {
      environmentclass: "q",
      zone: "fss",
      environment: "q0"
    },
    properties: {
      port: "4444",
      cicsname: "arandomcicsname",
      url: "tcp://cicsserver.org"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 41,
    created: "2014-05-09T10:14:35.6",
    updated: "2014-05-09T10:14:35.6",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "q",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/41",
      revisions: "http://localhost:9696/resources/41/revisions"
    }
  },
  {
    type: "webservicegateway",
    alias: "serviceGateway",
    scope: {
      environmentclass: "p",
      zone: "fss"
    },
    properties: {
      url: "https://service-gw.no/"
    },
    secrets: {},
    files: {},
    dodgy: false,
    id: 42,
    created: "2013-10-07T07:15:09.946",
    updated: "2013-10-07T07:15:09.946",
    lifecycle: {},
    accesscontrol: {
      environmentclass: "p",
      adgroups: []
    },
    usedbyapplications: [],
    links: {
      self: "http://localhost:9696/resources/42",
      revisions: "http://localhost:9696/resources/42/revisions"
    }
  },
  {
    type: "db2datasource",
    alias: "ThisMaDs",
    scope: {
      environmentclass: "u",
      zone: "fss",
      environment: "u69",
      application: "app1"
    },
    properties: {
      schema: "ohprettyschema",
      hostname: "schemaserver.se",
      port: "6969",
      dbaname: "BABOMBIBOM",
      username: "auser"
    },
    secrets: {
      password: {
        ref: "http://localhost:6969/mockapi/secrets/679729"
      }
    },
    files: {},
    usedbyapplications: [],
    dodgy: false,
    id: 69,
    revision: 4,
    created: "2014-10-29T14:19:14.756",
    updated: "2017-03-15T10:16:42.555",
    lifecycle: {
      status: "alerted",
      nextactiondate: "2017-06-13T10:16:42.554",
      issue: "AURAGC-7401"
    },
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    usedbyapplications: [
      {
        application: "modiabrukerdialog",
        environment: "u69",
        id: 200,
        version: "10.2.1",
        ref: "http://localhost:6969/mockapi/applicationinstances/404"
      },
      {
        application: "ruting",
        environment: "u70",
        id: 201,
        version: "6.0.14",
        ref: "http://localhost:6969/mockapi/applicationinstances/404"
      },
      {
        application: "gosys",
        id: 202,
        environment: "u96",
        version: "9.4.2",
        ref: "http://localhost:6969/mockapi/applicationinstances/404"
      }
    ],
    links: {
      self: "http://localhost:9696/resources/69",
      revisions: "http://localhost:9696/resources/69/revisions"
    }
  },
  {
    type: "datasource",
    alias: "henvendelseDataSource",
    scope: {
      environmentclass: "u",
      zone: "fss",
      environment: "u69",
      application: "henvendelse"
    },
    properties: {
      url: "jdbc:oracle:thin:@d26dbfl004.test.local:1521:henu",
      username: "bjarnebetjent"
    },
    secrets: {
      password: {
        ref: "https://e34jbsl01655.devillo.no:8443/api/v2/secrets/3580"
      }
    },
    files: {},
    lifecyclestatus: "rescued",
    usedbyapplications: [],
    dodgy: false,
    id: 96,
    created: "2013-04-12T13:07:12.157",
    updated: "2016-12-20T10:47:00.627",
    lifecycle: {
      status: "rescued",
      nextactiondate: "2017-12-20T10:47:00.626",
      issue: "AURAGC-6671"
    },
    accesscontrol: {
      environmentclass: "u",
      adgroups: []
    },
    links: {
      self: "http://localhost:9696/resources/69",
      revisions: "http://localhost:9696/resources/69/revisions"
    }
  }
]
