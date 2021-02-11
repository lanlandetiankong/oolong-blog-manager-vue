export const langMap = {
    button:{
        actions:{
            lookOver:'Look up',
            confirm:'Confirm',
            confirmSubmit:'Confirm Submit',
            cancel:'Cancel',
            query:'Query',
            reset:'Reset',
            operate:'Operate',
            addByForm:'Create',
            updateByForm:'Update',
            edit:'Edit',
            batchDelByIds:'Batch Delete',
            delById:'Delete',
            authorize:'Authorize',
            assigningRoles:'Assigning roles',
            assigningPermissions:'Assigning permissions',
            authorizationMenu:'Authorization menu',
            setPosition:'Set position',
            setAdminManager:'Set admin manager',
            importData:'Import data',
            exportData:'Export data',
            exportSelectedAsExcel:'Export selected as excel',
            exportAllAsExcel:'Export all as excel',
            uploadExportExcelTemplate:'Upload export excel template',
            uploadDataExcel:'Import data Excel file upload',
            lockUser:'Lock user',
            unlockUser:'Unlock user',
            lock:'Lock',
            unlock:'Unlock',
            startUsing:'Start using',
            publish:'Publish',
            saveAsDraft:'Save as draft',
            goToIndexPage:'Go to index page',
            filter:'Filter',
            switchToNextOne:'Switch to the next one',
            clearCache:'Clear cache',
            refreshMenuCache:'Refresh menu cache',
            goNextStep:'Next step',
            goPreviousStep:'Previous step',
            unfold:'Unfold',
            packUp:'Pack up'
        },
        member:{
            account:'Account',
            password:'Password',
            rememberMe:'Remember me',
            login:'Login',
            logOut:'Log out',
            ersonalCenter:'Personal Center',
            registerAnAccount:'Register an account',
            forgetPassword:'Forget password',
            verificationCode:'Captcha',
            loginForManager:'Log in to the management page'
        },
        placeholder:{
            pleaseEnterUserAccount:'Please enter user account',
            pleaseEnterUserPwd:'Please enter user password',
            filterSuperiors:'Filter superiors'
        }
    },
    layout:{
        tagsView:{
            close:'Close',
            closeOther:'Close other',
            closeAll:'Close all',
            cancelOperation:'Cancel operation',
        },
    },
    drawer:{
        actions:{
            detail:'Detail'
        },
        common:{
            undefinedEnumKeyValue:"Unexpected enumeration value"
        },
        em:{
            title:{
                detailForEmployeeInfo:'Detail for employee account',
                detailForAnnouncement:'Detail for announcement',
                detailForAnnouncementTag:'Detail for announcement tag',
                detailForAnnouncementDraft:'Detail for announcement draft',
                detailForDefineMenu:'Detail for define menu',
                detailForDefineDepartment:'Detail for define department',
                detailForDefineModule:'Detail for define module',
                detailForDefineRole:'Detail for define role',
                detailForDefineJob:'Detail for define job',
                detailForDefinePermission:'Detail for define permission',
                detailForDefineForm:'Detail for define form ',
                detailForDefineFormType:'Detail for define form type',
            }
        },
        obl:{
            title:{
                detailForArticle:'Detail for article',
                detailForOblArticleCategory:'Detail for article category',
                detailForOblArticleTag:'Detail for article tag',
                detailForArticleCollectCategory:'Detail for article collect category',
            }
        }
    },
    table:{
        header:{
            operation:'Operation',
            detail:'Detail',
            description:'Description',
            weights:'Weights',
            type:'Type'
        },
        config:{
            emptyData:'Empty data',
            showQuery:'Show query',
            hiddenQuery:'Hidden query'
        },
        fields:{
            common:{
                name:'Name',
                superiorName:'Superior name',
                title:'Title',
                code:'Code',
                type:'Type',
                remark:'Remark',
                createUserName:'Create user name',
                updateUserName:'Update user name',
                createTime:'Create time',
                updateTime:'Update time',
                description:'Description',
                level:'Level',
                keyword:'Keyword',
                content:'Content',
                lockStatus:'Lock Status',
                startUsingStatus:'Start Using Status',
                label:'Label',
                styleVal:'Style',
                tag:'Tag',
                tagName:'Tag name',
                category:'Category',
                categoryName:'Category name',
                lockedStatus:'Lock Status',
                weights:'Weights',
                summary:'Summary'
            },
            em:{
                user:{
                    userAccount:'User account',
                    userName:'Nick name',
                    avatarUrl:'Avatar',
                    email:'Email',
                    phone:'Phone Number',
                    userType:'User type',
                    sex:'Sex',
                    address:'Address'
                },
                module:{
                    iconName:'Icon Value',
                    moduleName:'Module name',
                },
                menu:{
                    menuName:'Menu name',
                    parentMenuName:'Parent menu name',
                    urlJumpType:'Url jump type',
                    routerUrl:'Router url',
                    hrefUrl:'Href url',
                    iconName:'Icon name',
                },
                job:{
                    jobName:'Job name',
                },
                department:{
                    departmentName:'Department name',
                    parentDepartmentName:' Parent department name',
                    belongDepartment:'Belong department',
                    publishDepartment:'Publish department',
                },
                role:{
                    roleName:'Role name',
                },
                permission:{
                    permissionName:'Permission name'
                },
                form:{
                    formName:'Form name',
                    formTitle:'Form title',
                },
                formType:{
                    formTypeName:'Form type name',
                },
                announcement:{
                    title:'Title',
                    keyWord:'key word',
                    tagNameOfStr:'Tag Name',
                    content:'Content',
                    publishDepartment:'Publishing department'
                },
                announcementTag:{
                    tagName:'Tag Name',
                    description:'Description'
                },
                sysDic:{
                    name:'Dic name',
                    type:'Type',
                    code:'Code',
                    value:'Value'
                }
            },
            obl:{
                article:{
                    title:'Title',
                    content:'Content',
                    summary:'Summary',
                    tagNames:'Tag',
                    categoryNames:'Category',
                    editorType:'Editor type',
                    viewCount:'View count',
                    commentCount:'Comment count',
                    likeCount:'Like count',
                    collectCount:'Collect count',
                    auditState:'Approval status',
                    isPublished:'Published status',
                    publishTime:'Published time',
                    tagIds:'Tag id',
                    tagName:'Tag'
                },
                articleCategory:{
                    name:'Name',
                    iconName:'Icon name',
                    parentName:'Parent name'
                },
                articleTag:{
                    name:'Name'
                },
                articleCollectCategory:{
                    name:'Name',
                    iconName:'Icon name',
                    parentName:'Parent name'
                },
                userAccount:{
                    account:'User account',
                    userName:'User name',
                    avatarUrl:'Avatar',
                    email:'Email',
                    userType:'User type',
                }
            }
        },
    },
    commons:{
        quill:{
            announcement:{
                placeholder:'Please enter announcement content'
            }
        },
        forms:{
            pleaseChoose:'Please choose',
            chooseDepartment:'Choose department',
            pleaseEnterTitle:'Please enterTitle',
            tips:{
                lookUpIcon:'Click to view optional icons',
                selectedIcon:'Selected icon'
            },
            pleaseFillOut:'Please fill out {0}',
            pleaseSelect:'Please tick {0}',
            fillInValid:'Please fill in valid{0}',
            pleaseFillOutTwo:'{0} or {1} cannot be empty'
        },
        enums:{
            lockStatus:{
                locked:'Locked',
                unlock:'Unlock'
            },
            publishStatus:{
                published:'Published',
                unpublished:'Unpublished',
            },
            auditStatus:{
                notApproved:'Not approved',
                approval:'Approval',
                approved:'Approved'
            },
            jobType:{
                simpleJob:'Simple job'
            },
            menuUrlJumpType:{
                routerUrl:'Router jump',
                outUrl:'Open external links',
                outUrlBlank:'Open external link on new page',
            },
            moduleType:{
                defaultHas:'Default has',
                authorizedDistribution:'Authorized distribution',
            },
            roleType:{
                simpleRole:'Simple role',
                managerRole:'Manager role',
            },
            permissionType:{
                pageButton:'Page button',
                tableActionBtn:'Table action button'
            },
            userSex:{
                man:'Man',
                woman:'Woman',
            },
            userType:{
                simpleUser:'Simple user',
                root:'Root',
                superRoot:'Super root',
                vip:'Vip',
                superVip:'Super vip',
                generatedUser:'Generated user',
            },
            switch:{
                open:'Open',
                close:'Close'
            }
        },
        valueMap:{
            transferConf:{
                titleArr:['Not selected','chosen'],
                locale:{
                    itemUnit:'Item',
                    itemsUnit: 'Items',
                    notFoundContent: 'List is empty',
                    searchPlaceholder:'Search here'
                },
                operations:['Select','Cancel']
            },
            uploader:{
                status:{
                    uploading:'Uploading...',
                    confirmUpload:'Confirm upload'
                },
                altInfo:'Image failed to load',
                atLeastNumberOfFiles:'Please select at least {0} files and submit!',
                maximumNumberOfFiles:'Select up to {0} Excel file',
                rangeSizeOfFiles:' Select up to {0}-{1} Excel files',
                popover:{
                    prompt:'Upload tips',
                    message:{
                        excel:'Please select the .xls or .xlsx format Excel file correctly',
                        image:{
                            limitSize:'Picture file must be less than {0}MB!',
                            onlySupportJpg:'Only .jpg files are allowed to upload!'
                        }
                    }
                }
            }
        },
        dashBoard:{
            universal:'Universal',
            announcementList:'Announcement list',
            articleList:'Article list',
        }
    },
    message:{
        warning:{
            pleaseSelectTheOnlyRowOfDataForUpdate:'Please select the only row of data for update!',
            pleaseSelectTheOnlyRowOfDataForDelete:'Please select the only row of data for delete!',
            pleaseSelectTheOnlyRowOfDataForStartUsing:'Please select the only row of data for start using!',
            pleaseSelectTheOnlyRowOfDataForSetPosition:'Please select the only row of data for set position!',
            pleaseSelectTheOnlyRowOfDataForLock:'Please select the only row of data for lock!',
            pleaseSelectTheOnlyRowOfDataForAssigningPermissions:'Please select the only row of data for assigning permissions!',
            pleaseSelectTheOnlyRowOfDataForAuthorizationMenu:'Please select the only row of data for authorization menu!',
            pleaseSelectTheOnlyRowOfDataForUploadExcelTemplate:'Please select the only row of data for upload excel template!',
            pleaseSelectTheOnlyRowOfDataForExport:'Please select the only row of data for export!',
            invalidDeleteOperation:'Invalid delete operation!',
            invalidLockOperation:'Invalid lock operation!',
            invalidPublishOperation:'Invalid publish operation!',
            openInvalidRowDetails:'Open invalid row details!',
            doNotAllowSelectionOfStartUsing:'The selected item contains enabled items. Please uncheck all enabled items and try again!',
        },
        error:{
            failedDueToNotGettingId:'Failed due to not getting id !',
            wrongVerificationCode:'Wrong verification code!',
            unknownExportCommand:'Unknown export command!',
            currentPageDoesNotSupportExportOperations:'Current page does not support export operations!',
            pageNotFound:'Page not found!',
            unknowUser:'Unknown user'
        },
        confirm:{
            isConfirmDeleteSelectedRow:'Are you confirm delete selected row？',
            isConfirmDeleteWhatSelectedRow:'Are you sure to delete the selected {0} row？',
            isConfirmPublishSelectedRow:'Are you confirm publish selected row？',
            isConfirmPublishWhatSelectedRow:'Are you sure to publish the selected {0} row？',
            isConfirmLockSelectedRow:'Are you confirm lock selected row？',
            isConfirmLockWhatSelectedRow:'Are you sure to lock the selected {0} row？',
            isConfirmStartUsingWhatSelectedRow:'Once enabled, it cannot be disabled! Please confirm again whether to enable the selected {0} row?',
        },
        info:{
            actionOfCancelDelete:'Action:Cancel delete',
            actionOfCancelLock:'Action:Cancel Lock',
            actionOfCancelStartUsing:'Action:Cancel start using',
            actionOfCancelPublish:'Action:Cancel publish',
            tableCheckedSize:"Quantity selected:{0} ."
        }
    },
    http:{
        notify:{
            message:{
                success:'Info:',
                warning:'Warning:',
                error:'Error:'
            },
            description:{
                requestError:'Request error',
                grantFailed:'Authorization failed. Please login again!',
                accessDenied:'Access denied',
                resourceNotFound:'Request error,the resource was not found',
                serverDistracted:'The server is out of order',
                sessionExpired:'The session information has expired, please log in again!'
            }
        }
    },
    steps:{
        //必须有key切key必须为英文(请勿修改key)
        article:{
            create:{
                basic:{
                    key:'basic',
                    title:'Write',
                    description:'Write article'
                },
                more:{
                    key:'more',
                    title:'Other',
                    description:'Select label and category'
                },
                done:{
                    key:'done',
                    title:'Submit',
                    description:'Submit an article'
                }
            }
        }
    },
    results:{
        universal:{
            success:{
                title:'Successful operation'
            },
            failure:{
                title:'Operation failed',
                extra:{
                    serverError:'System error'
                }
            }
        },
        article:{
            create:{
                success:{
                    extra:{
                        viewDetail:'View article'
                    }
                },
                failure:{
                    extra:{
                        retry:'Retry'
                    }
                }
            }
        }
    }
}
